import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download
} from "lucide-react";

const OrderDetailPage = () => {
  const { id } = useParams(); // Ambil Order ID dari URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data detail pesanan dari Backend
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat Detail Pesanan...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Pesanan tidak ditemukan.</div>;

  // Helper untuk Status Warna & Ikon
  const getStatusInfo = (status) => {
    switch (status) {
      case "paid": return { color: "bg-green-100 text-green-700", icon: CheckCircle, label: "Pembayaran Berhasil" };
      case "shipped": return { color: "bg-blue-100 text-blue-700", icon: Truck, label: "Sedang Dikirim" };
      case "delivered": return { color: "bg-purple-100 text-purple-700", icon: Package, label: "Pesanan Selesai" };
      case "cancelled": return { color: "bg-red-100 text-red-700", icon: XCircle, label: "Dibatalkan" };
      default: return { color: "bg-orange-100 text-orange-700", icon: Clock, label: "Menunggu Pembayaran" };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  // Timeline Sederhana (Logika Visual)
  const steps = ["pending", "paid", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf(order.status) === -1 ? 0 : steps.indexOf(order.status);

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans py-8">
      <div className="container mx-auto max-w-4xl px-4">
        
        {/* Header Navigasi */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/profile" className="flex items-center gap-2 text-gray hover:text-primary transition font-medium">
            <ArrowLeft size={20} /> Kembali ke Profil
          </Link>
          <div className="text-sm text-gray">
            Order ID: <span className="font-mono font-bold text-dark">#{order.id}</span>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusInfo.color}`}>
                <StatusIcon size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark">{statusInfo.label}</h1>
                <p className="text-gray text-sm flex items-center gap-1 mt-1">
                  <Calendar size={14} /> 
                  {new Date(order.created_at).toLocaleDateString("id-ID", { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            
            {/* Tombol Aksi */}
            <div className="flex gap-3">
              {order.status === "pending" && (
                <Link 
                  to={`/payment/qris/${order.id}`}
                  className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-primary/20"
                >
                  Bayar Sekarang
                </Link>
              )}
              {["paid", "shipped", "delivered"].includes(order.status) && (
                <Link 
                  to={`/invoice/${order.id}`}
                  className="bg-white border border-gray-200 text-dark px-4 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition flex items-center gap-2"
                >
                  <Download size={18} /> Lihat Invoice
                </Link>
              )}
            </div>
          </div>

          {/* Stepper / Timeline Visual (Hanya muncul jika tidak Cancelled) */}
          {order.status !== 'cancelled' && (
            <div className="mt-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full -z-10"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full -z-10 transition-all duration-500" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
              
              <div className="flex justify-between">
                {[
                  { id: "pending", label: "Pesanan Dibuat" },
                  { id: "paid", label: "Dibayar" },
                  { id: "shipped", label: "Dikirim" },
                  { id: "delivered", label: "Selesai" }
                ].map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-colors ${
                        isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-200 text-gray-400"
                      }`}>
                        {isCompleted ? <CheckCircle size={14} /> : index + 1}
                      </div>
                      <span className={`text-xs font-bold ${isCompleted ? "text-dark" : "text-gray-400"}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom Kiri: Item Pesanan */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Package className="text-primary" size={20} /> Rincian Produk
              </h2>
              <div className="space-y-4">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {/* Gambar Buku */}
                       <img 
                          src={item.image || "https://placehold.co/400x600?text=No+Image"} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-dark text-sm md:text-base line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-gray mb-2">{item.author}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray font-medium">{item.quantity} x {formatCurrency(item.price)}</span>
                        <span className="font-bold text-primary">{formatCurrency(item.quantity * item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Info Pengiriman & Pembayaran */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="text-primary" size={20} /> Info Pengiriman
              </h2>
              <div className="text-sm">
                <p className="font-bold text-dark mb-1">Penerima</p>
                {/* Fallback data dummy jika di tabel orders belum ada kolom nama penerima terpisah */}
                <p className="text-gray mb-3">{order.customer_name || "Nama Penerima"}</p>
                
                <p className="font-bold text-dark mb-1">Alamat</p>
                <p className="text-gray leading-relaxed">
                  {order.shipping_address || "Alamat tidak tersedia."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="text-primary" size={20} /> Rincian Pembayaran
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray">
                  <span>Metode</span>
                  <span className="font-medium text-dark uppercase">{order.payment_method || "QRIS"}</span>
                </div>
                <div className="flex justify-between text-gray">
                  <span>Subtotal Produk</span>
                  <span className="font-medium text-dark">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-gray">
                  <span>Ongkos Kirim</span>
                  <span className="font-medium text-green-600">Gratis (Promo)</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
                  <span className="font-bold text-dark">Total Bayar</span>
                  <span className="font-bold text-xl text-primary">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;