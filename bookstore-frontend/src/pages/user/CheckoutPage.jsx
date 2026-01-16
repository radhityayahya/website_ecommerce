import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../services/dataService";
import {
  Smartphone,
  Building2,
  Check,
  Truck,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const checkoutItems = location.state?.items || cart;
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [shippingMethod, setShippingMethod] = useState("regular");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    state: "",
    postcode: "",
    city: "",
  });

  // LOGIKA PERHITUNGAN HARGA (DIPERBAIKI)
  const subtotal = checkoutItems.reduce((sum, item) => sum + (parseInt(item.price) * parseInt(item.quantity)), 0);
  const tax = subtotal * 0.11;
  const shippingCost = shippingMethod === "express" ? 25000 : 15000;
  const total = subtotal + tax + shippingCost; // Total yang benar-benar dikirim ke backend

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCFCFD]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-dark">Keranjang Kosong</h2>
          <button onClick={() => navigate("/bookstore")} className="text-primary hover:underline font-bold">
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (!formData.firstName || !formData.phone || !formData.address) {
      toast.error("Mohon lengkapi alamat pengiriman");
      return;
    }

    setIsLoading(true);

    try {
      // KIRIM KE BACKEND (LOGIKA BARU)
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: checkoutItems,
          total: total, // Mengirim total yang sudah dihitung di sini (bukan 0)
          paymentMethod: paymentMethod
        })
      });

      const result = await response.json();

      if (result.success) {
        // Jika beli dari keranjang, kosongkan
        if (!location.state?.items) {
            clearCart();
        }
        
        toast.success("Pesanan berhasil dibuat!");
        
        // Arahkan ke halaman pembayaran dengan data Order ID dari database
        navigate(`/payment/qris/${result.orderId}`, {
            state: { total: total, orderId: result.orderId }
        });
      } else {
        toast.error("Gagal membuat pesanan");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Terjadi kesalahan koneksi");
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    { id: "bank", name: "Bank Transfer", icon: Building2 },
    { id: "qris", name: "QRIS", icon: Smartphone },
  ];

  const shippingOptions = [
    { id: "regular", name: "Regular Shipping", desc: "3-5 Hari Kerja", price: 15000 },
    { id: "express", name: "Express Shipping", desc: "1-2 Hari Kerja", price: 25000 },
  ];

  return (
    <div className="bg-[#FCFCFD] min-h-screen pb-12 font-sans">
      <div className="container mx-auto max-w-[1400px] px-6 py-8">
        <div className="text-sm text-gray-500 mb-8">
          <span>Home / Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center max-w-4xl mx-auto">
            {[
              { step: 1, label: "Summary", active: true, completed: true },
              { step: 2, label: "Checkout", active: true, completed: false },
              { step: 3, label: "Payment", active: false, completed: false },
            ].map((item, index, arr) => (
              <div key={item.step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-colors ${item.active || item.completed ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                    {item.completed ? <Check size={20} /> : item.step}
                  </div>
                  <span className={`text-xs md:text-sm font-medium mt-2 absolute -bottom-6 w-32 text-center ${item.active ? "text-primary" : "text-gray-400"}`}>{item.label}</span>
                </div>
                {index < arr.length - 1 && <div className={`h-1 w-full mx-2 rounded-full ${item.completed ? "bg-primary" : "bg-gray-200"}`}></div>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input Forms */}
            <div className="col-span-1 lg:col-span-8 space-y-8">
              
              {/* 1. Buyer Info */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-dark">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                  Informasi Pengiriman
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Depan</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Belakang</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" required readOnly={!!user} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">No. Handphone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Alamat Lengkap</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" placeholder="Nama Jalan, No. Rumah, RT/RW" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kota</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Provinsi</label>
                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Kode Pos</label>
                        <input type="text" name="postcode" value={formData.postcode} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition-colors" />
                    </div>
                </div>
              </div>

              {/* 2. Review Items */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-dark">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                  Barang Pesanan
                </h2>
                <div className="space-y-4">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img 
                            src={item.image || "https://placehold.co/400x600?text=No+Img"} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {e.target.src = "https://placehold.co/400x600?text=No+Img"}}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-dark text-sm line-clamp-2">{item.title}</h4>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-sm font-medium text-gray-500">Qty: {item.quantity}</span>
                          <span className="font-bold text-primary">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Delivery Method */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-dark">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                  Pengiriman
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shippingOptions.map((option) => (
                    <label key={option.id} className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${shippingMethod === option.id ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"}`}>
                      <input type="radio" name="shipping" className="mt-1 accent-primary" checked={shippingMethod === option.id} onChange={() => setShippingMethod(option.id)} />
                      <div className="flex-1">
                        <div className="font-bold text-dark flex items-center gap-2">{option.name} <Truck size={16} className="text-gray-400" /></div>
                        <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                        <p className="text-sm font-bold text-primary mt-2">{formatCurrency(option.price)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Payment & Summary */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-lg mb-4 text-dark">Metode Pembayaran</h3>
                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${paymentMethod === method.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-gray-200 hover:border-gray-300"}`}>
                        <div className={`p-2 rounded-lg ${paymentMethod === method.id ? "bg-white" : "bg-gray-100"}`}>
                          <Icon size={24} className={paymentMethod === method.id ? "text-primary" : "text-gray-500"} />
                        </div>
                        <span className={`font-medium ${paymentMethod === method.id ? "text-primary" : "text-dark"}`}>{method.name}</span>
                        {paymentMethod === method.id && <Check size={18} className="ml-auto text-primary" />}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-6 border-t border-gray-100 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium text-dark">{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Pajak (11%)</span><span className="font-medium text-dark">{formatCurrency(tax)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Pengiriman</span><span className="font-medium text-dark">{formatCurrency(shippingCost)}</span></div>
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                    <span className="text-lg font-bold text-dark">Total Bayar</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? "Memproses..." : "BUAT PESANAN"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;