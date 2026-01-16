import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { Clock, CheckCircle2, XCircle, Copy, ArrowLeft, Check } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const PaymentQRISPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Ambil data order dari state navigasi, atau fallback object kosong agar tidak error
  const orderData = location.state?.order || {}; 
  const toast = useToast();
  
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 menit hitung mundur
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, checking, success, failed
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
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
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleManualConfirmation = () => {
    setShowConfirmModal(true);
  };

  // === BAGIAN UTAMA YANG DIUBAH (INTEGRASI BACKEND) ===
  const processPaymentConfirmation = async () => {
    setShowConfirmModal(false);
    setPaymentStatus("checking");

    try {
      // Panggil API Backend untuk update status di database MySQL
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}/pay`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        // Jika backend berhasil update database
        setPaymentStatus("success");
        toast.success("Pembayaran Berhasil Dikonfirmasi!");
        
        // Tunggu sebentar untuk menampilkan animasi sukses, lalu pindah halaman
        setTimeout(() => {
          // Arahkan ke halaman Invoice/Riwayat (atau Order Success jika Anda punya)
          navigate("/invoices", { replace: true });
        }, 2000);
      } else {
        // Jika backend menolak
        setPaymentStatus("pending");
        toast.error("Gagal memproses pembayaran. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setPaymentStatus("pending");
      toast.error("Terjadi kesalahan koneksi ke server.");
    }
  };
  // ======================================================

  const handleCheckPayment = () => {
    setPaymentStatus("checking");
    // Simulasi cek status (bisa diganti API GET order detail jika ada)
    setTimeout(() => {
        // Karena kita belum buat API khusus 'cek status otomatis', 
        // kita kembalikan ke pending dan minta user klik "Sudah Bayar" manual
        toast.info("Silakan klik tombol 'Sudah Bayar' jika Anda telah menyelesaikan transaksi.");
        setPaymentStatus("pending");
    }, 1500);
  };

  const handleCopyQRCode = () => {
    const qrText = `QRIS://payment/${orderId}`;
    navigator.clipboard.writeText(qrText);
    toast.success("Teks QR Code disalin!");
  };

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
        {/* Progress Steps */}
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

        <Link to="/bookstore" className="inline-flex items-center gap-2 text-gray hover:text-primary mb-8">
          <ArrowLeft size={20} /> Kembali ke Toko
        </Link>

        <div className="grid grid-cols-12 gap-8">
          {/* Kiri: Area Scan QR */}
          <div className="col-span-7">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <h2 className="text-3xl font-bold mb-2">Scan QRIS untuk Bayar</h2>
              <p className="text-gray mb-8">Gunakan aplikasi mobile banking atau e-wallet Anda</p>
              
              <div className="inline-flex items-center gap-2 bg-[#FFF3E0] text-[#F57C00] px-6 py-3 rounded-xl mb-8">
                <Clock size={20} />
                <span className="font-bold text-lg">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </span>
                <span className="text-sm">waktu tersisa</span>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-white p-8 rounded-2xl shadow-lg inline-block mb-6 border-4 border-gray-100">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=INV-${orderId}`} 
                    alt="QR Code" 
                    className="w-[250px] h-[250px]"
                />
              </div>

              <button
                onClick={handleCopyQRCode}
                className="flex items-center gap-2 mx-auto text-primary hover:text-opacity-80 mb-8">
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
                <div className="bg-green-50 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 justify-center">
                  <CheckCircle2 size={24} />
                  <p className="font-bold text-lg">Pembayaran Berhasil!</p>
                </div>
              )}
              {paymentStatus === "failed" && (
                <div className="bg-red-50 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 justify-center">
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
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 mb-4 action-button">
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
                  <span className="text-primary font-medium">0812-3456-7890</span>
                </p>
              </div>
            </div>

            {/* Instruksi Pembayaran */}
            <div className="bg-[#F1F0FF] rounded-2xl p-6 mt-6">
              <h3 className="font-bold text-lg mb-4">Cara Pembayaran</h3>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                  <span>Buka aplikasi mobile banking atau e-wallet yang mendukung QRIS</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                  <span>Pilih menu "Scan QR" atau "QRIS"</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                  <span>Scan QR Code yang ditampilkan di atas</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
                  <span>Konfirmasi pembayaran di aplikasi Anda</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">5</span>
                  <span>Klik "Sudah Bayar" setelah selesai</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Kanan: Ringkasan Pesanan */}
          <div className="col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold mb-6">Ringkasan Pesanan</h3>
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray">Order ID</span>
                  <span className="font-mono font-bold">#{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray">Metode Pembayaran</span>
                  <span className="font-medium">QRIS</span>
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="font-bold mb-3">Informasi Pembeli</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray">Nama</span>
                    <span className="font-medium">
                      {orderData.firstName || "-"} {orderData.lastName || ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Email</span>
                    <span className="font-medium text-xs">{orderData.email || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray">Telepon</span>
                    <span className="font-medium">{orderData.phone || "-"}</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Pembayaran</span>
                  <span className="text-3xl font-bold text-primary">
                    {formatCurrency(orderData.totalAmount || orderData.total || 0)}
                  </span>
                </div>
              </div>
              <div className="bg-[#FFF3E0] p-4 rounded-xl">
                <p className="text-sm text-[#F57C00]">
                  <strong>Penting:</strong> Pastikan nominal yang Anda bayar sesuai dengan total di atas
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