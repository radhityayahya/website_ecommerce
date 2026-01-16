import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { Clock, CheckCircle2, XCircle, Copy, ArrowLeft, Check, Smartphone } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const PaymentQRISPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // --- STATE & DATA ---
  // Coba ambil dari state navigasi dulu (dari halaman Checkout)
  const [orderData, setOrderData] = useState(location.state?.order || {});
  
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, checking, success, failed
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. BACKUP DATA: Jika di-refresh, ambil data order dari database
  useEffect(() => {
    // Jika tidak ada data total di state (karena refresh), fetch dari API
    if (!orderData.totalAmount && !orderData.total) {
        setLoading(true);
        fetch(`http://localhost:3001/api/orders/${orderId}`)
            .then(res => {
                if (!res.ok) throw new Error("Order not found");
                return res.json();
            })
            .then(data => {
                // Mapping data dari DB ke format state yang diharapkan UI
                setOrderData({
                    id: data.id,
                    totalAmount: parseFloat(data.total_amount),
                    // Jika user join ada di query backend, bisa ditambahkan di sini
                    // Untuk sekarang kita pakai fallback "-"
                    firstName: "-", 
                    lastName: "",
                    email: "-",
                    phone: "-" 
                });
                // Cek jika sudah lunas
                if (data.status === 'paid' || data.status === 'shipped') {
                    setPaymentStatus('success');
                }
            })
            .catch(err => console.error("Gagal fetch order:", err))
            .finally(() => setLoading(false));
    }
  }, [orderId, orderData]);

  // 2. TIMER MUNDUR
  useEffect(() => {
    if (paymentStatus === 'success') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus("failed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentStatus]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // 3. LOGIKA PEMBAYARAN (DATABASE)
  const processPaymentConfirmation = async () => {
    setShowConfirmModal(false);
    setPaymentStatus("checking");

    try {
      // API Call: Update status order jadi 'paid'
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/pay`, {
        method: "PUT", // Biasanya update pakai PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 'paid' })
      });

      if (response.ok) {
        setPaymentStatus("success");
        toast.success("Pembayaran Berhasil Dikonfirmasi!");
        
        setTimeout(() => {
          navigate(`/order/success/${orderId}`);
        }, 2000);
      } else {
        setPaymentStatus("pending");
        toast.error("Gagal memproses pembayaran. Coba lagi.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setPaymentStatus("pending");
      toast.error("Terjadi kesalahan koneksi.");
    }
  };

  const handleManualConfirmation = () => {
    setShowConfirmModal(true);
  };

  const handleCheckPayment = () => {
    // Simulasi cek (karena belum ada webhook real)
    setPaymentStatus("checking");
    setTimeout(() => {
        toast.info("Pembayaran belum terdeteksi otomatis. Silakan klik 'Sudah Bayar' manual.");
        setPaymentStatus("pending");
    }, 1500);
  };

  const handleCopyQRCode = () => {
    const qrText = `QRIS://payment/${orderId}`;
    navigator.clipboard.writeText(qrText);
    toast.success("Teks QR Code disalin!");
  };

  // Nilai Total (Handle berbagai kemungkinan nama field)
  const displayTotal = orderData.totalAmount || orderData.total || 0;

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Memuat Data Pembayaran...</div>;
  }

  return (
    <div className="bg-[#FCFCFD] min-h-screen">
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={processPaymentConfirmation}
        title="Konfirmasi Pembayaran"
        message="Apakah Anda yakin sudah melakukan pembayaran melalui QRIS?"
        confirmText="Ya, Sudah Bayar"
        cancelText="Batal"
      />
      <div className="container mx-auto max-w-[1200px] px-6 py-8">
        
        {/* Progress Steps (Visual) */}
        <div className="mb-12">
          <div className="flex items-center justify-center max-w-4xl mx-auto">
            {[
              { step: 1, label: "Summary", active: true, completed: true },
              { step: 2, label: "Checkout", active: true, completed: true },
              { step: 3, label: "Payment", active: true, completed: false },
              { step: 4, label: "Shipping", active: false, completed: false },
            ].map((item, index, arr) => (
              <div key={item.step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors ${
                      item.active || item.completed ? "bg-primary text-white" : "bg-gray-200 text-gray"
                    }`}>
                    {item.completed ? <Check size={20} /> : item.step}
                  </div>
                  <span
                    className={`text-xs md:text-sm font-medium mt-2 absolute -bottom-6 w-32 text-center ${
                      item.active ? "text-primary" : "text-gray"
                    }`}>
                    {item.label}
                  </span>
                </div>
                {index < arr.length - 1 && (
                  <div
                    className={`h-1 w-full mx-2 rounded-full ${
                      item.completed ? "bg-primary" : "bg-gray-200"
                    }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 text-gray hover:text-primary mb-8">
          <ArrowLeft size={20} /> Kembali ke Toko
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Kiri: Area Scan QR */}
          <div className="col-span-1 md:col-span-7">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center border border-gray-100">
              <h2 className="text-3xl font-bold mb-2 text-dark">Scan QRIS untuk Bayar</h2>
              <p className="text-gray mb-8">Gunakan aplikasi mobile banking atau e-wallet Anda</p>
              
              <div className="inline-flex items-center gap-2 bg-[#FFF3E0] text-[#F57C00] px-6 py-3 rounded-xl mb-8 border border-orange-100">
                <Clock size={20} />
                <span className="font-bold text-lg font-mono">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                <span className="text-sm">waktu tersisa</span>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-white p-6 rounded-2xl shadow-inner inline-block mb-6 border-2 border-dashed border-gray-300">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=INV-${orderId}`} 
                    alt="QR Code" 
                    className="w-[250px] h-[250px] mix-blend-multiply"
                />
              </div>

              <button
                onClick={handleCopyQRCode}
                className="flex items-center gap-2 mx-auto text-primary font-bold hover:text-opacity-80 mb-8 transition">
                <Copy size={18} /> Salin Kode QR
              </button>

              {/* Status Messages */}
              {paymentStatus === "checking" && (
                <div className="bg-blue-50 text-blue-700 px-6 py-4 rounded-xl mb-6">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="font-medium">Memproses pembayaran...</p>
                </div>
              )}
              {paymentStatus === "success" && (
                <div className="bg-green-50 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 justify-center border border-green-200">
                  <CheckCircle2 size={24} />
                  <p className="font-bold text-lg">Pembayaran Berhasil!</p>
                </div>
              )}
              {paymentStatus === "failed" && (
                <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 justify-center border border-red-200">
                  <XCircle size={24} />
                  <p className="font-bold">Waktu pembayaran habis</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleManualConfirmation}
                  disabled={
                    paymentStatus === "checking" || paymentStatus === "success" || timeLeft === 0
                  }
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 mb-2">
                  Sudah Bayar
                </button>
                <button
                  onClick={handleCheckPayment}
                  disabled={
                    paymentStatus === "checking" || paymentStatus === "success" || timeLeft === 0
                  }
                  className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Cek Status Pembayaran
                </button>
              </div>

              <div className="mt-6 text-sm text-gray">
                <p>
                  Atau hubungi CS jika ada kendala:{" "}
                  <span className="text-primary font-bold">0812-3456-7890</span>
                </p>
              </div>
            </div>

            {/* Instruksi Pembayaran */}
            <div className="bg-[#F1F0FF] rounded-2xl p-6 mt-6 border border-primary/10">
              <h3 className="font-bold text-lg mb-4 text-dark">Cara Pembayaran</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                {[
                    "Buka aplikasi mobile banking atau e-wallet yang mendukung QRIS",
                    "Pilih menu 'Scan QR' atau 'QRIS'",
                    "Scan QR Code yang ditampilkan di atas",
                    "Konfirmasi pembayaran di aplikasi Anda",
                    "Klik 'Sudah Bayar' setelah selesai"
                ].map((step, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{idx + 1}</span>
                        <span className="leading-relaxed">{step}</span>
                    </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Kanan: Ringkasan Pesanan */}
          <div className="col-span-1 md:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-dark">Ringkasan Pesanan</h3>
              
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-mono font-bold text-dark">#{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Metode Pembayaran</span>
                  <div className="flex items-center gap-2 font-bold text-dark">
                    <Smartphone size={16} className="text-primary"/> QRIS
                  </div>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="font-bold mb-4 text-dark text-sm uppercase tracking-wide">Informasi Pembeli</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nama</span>
                    <span className="font-medium text-dark">
                      {orderData.firstName && orderData.lastName 
                        ? `${orderData.firstName} ${orderData.lastName}`
                        : "Guest"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-dark">{orderData.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Telepon</span>
                    <span className="font-medium text-dark">{orderData.phone || "-"}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-bold text-dark">Total Pembayaran</span>
                </div>
                <div className="text-3xl font-extrabold text-primary text-right">
                    {formatCurrency(displayTotal)}
                </div>
              </div>

              <div className="bg-[#FFF3E0] p-4 rounded-xl border border-orange-100">
                <p className="text-sm text-[#E65100] leading-relaxed">
                  <strong>Penting:</strong> Pastikan nominal yang Anda bayar sesuai dengan total di atas agar verifikasi otomatis berjalan lancar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentQRISPage;