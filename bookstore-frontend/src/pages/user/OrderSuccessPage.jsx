import { useParams, useLocation, Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { CheckCircle2, Download, Home, Package, Truck, MapPin, Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  
  // LOGIKA BARU: Cek state dulu, kalau kosong baru fetch dari API
  const [orderData, setOrderData] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!orderData) {
      fetch(`http://localhost:3001/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
            // Mapping data API ke format yang UI harapkan
            setOrderData({
                ...data,
                total: data.total_amount, // Backend pakai snake_case, UI pakai camelCase
                firstName: "Customer",    // Placeholder karena di tabel order cuma ada user_id
                lastName: "",
                phone: "-",               // Bisa ditambah di tabel orders jika mau
                address: data.shipping_address,
                items: data.items
            });
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [orderId, orderData]);

  if (loading) return <div className="text-center py-20">Memuat data pesanan...</div>;
  if (!orderData) return <div className="text-center py-20">Pesanan tidak ditemukan.</div>;

  // --- TAMPILAN DI BAWAH INI SAMA PERSIS DENGAN FILE ASLI ANDA ---
  
  const timelineSteps = [
    { title: "Pesanan Dibuat", date: new Date(orderData.created_at || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), completed: true },
    { title: "Pembayaran Dikonfirmasi", date: "Selesai", completed: true },
    { title: "Diproses Penjual", date: "Sedang Berjalan", completed: true, current: true },
    { title: "Diserahkan ke Kurir", date: "Estimasi Besok", completed: false },
    { title: "Pesanan Tiba", date: "Estimasi 3-5 Hari", completed: false },
  ];

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans pb-20">
      <div className="container mx-auto max-w-[1000px] px-6 py-8">
        <div className="mb-12">
          <div className="flex items-center justify-center max-w-4xl mx-auto">
            {[
              { step: 1, label: "Shopping Summary", active: true, completed: true },
              { step: 2, label: "Checkout", active: true, completed: true },
              { step: 3, label: "Payment", active: true, completed: true },
              { step: 4, label: "Shipping", active: true, completed: false }, 
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-800">Pembayaran Berhasil!</h1>
                <p className="text-green-700 text-sm">
                  Terima kasih telah berbelanja. Pesanan Anda sedang dipersiapkan.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Truck className="text-primary" size={20} /> Status Pengiriman
              </h3>
              <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-2">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-[25px] top-0 w-4 h-4 rounded-full border-2 ${
                        step.completed ? "bg-primary border-primary" : "bg-white border-gray-300"
                      } ring-4 ring-white`}></div>
                    <div className={`${step.completed ? "opacity-100" : "opacity-50"}`}>
                      <h4
                        className={`font-bold text-sm leading-none ${
                          step.current ? "text-primary" : "text-dark"
                        }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray mt-1">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Package className="text-primary" size={20} /> Rincian Produk
              </h3>
              {orderData.items && orderData.items.length > 0 ? (
                <div className="space-y-4">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0 bg-cover bg-center" style={{backgroundImage: `url(${item.image || ''})`, backgroundColor: '#e5e7eb'}}></div>
                      <div className="flex-1">
                        <h4 className="font-bold text-dark line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-gray mb-1">{item.author}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-medium text-gray-500">
                            {item.quantity} x {formatCurrency(item.price)}
                          </span>
                          <span className="font-bold text-primary">
                            {formatCurrency(item.quantity * item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Memuat rincian produk...</p>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="text-primary" size={20} /> Info Pengiriman
              </h3>
              <div className="text-sm space-y-1">
                <p className="font-bold text-dark">
                  {orderData.firstName} {orderData.lastName}
                </p>
                <p className="text-gray">{orderData.phone}</p>
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {/* Gunakan split jika data address digabung di satu string */}
                  {orderData.address}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray mb-1">No. Resi</p>
                <div className="flex items-center gap-2 font-mono font-bold text-dark bg-gray-50 p-2 rounded-lg">
                  JP{Date.now().toString().slice(-10)}{" "}
                  <Copy size={14} className="text-gray cursor-pointer hover:text-primary" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray text-sm">Order ID</span>
                <span className="font-mono font-bold">{orderId}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="font-bold text-lg text-dark">Total</span>
                <span className="font-bold text-xl text-primary">
                  {formatCurrency(orderData.total || 0)}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <Link to={`/invoice/${orderId}`} className="w-full bg-white border border-gray-200 text-dark py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <Download size={18} /> Invoice
              </Link>
              <Link
                to="/"
                className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition">
                <Home size={18} /> Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccessPage;