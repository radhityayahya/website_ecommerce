import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../services/dataService";
import { Package, Clock, CheckCircle, XCircle, ArrowRight, ShoppingBag } from "lucide-react";

const UserInvoicesPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/user/${user.id}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-[#FCFCFD] min-h-screen py-10 font-sans">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-dark">Riwayat Pesanan</h1>
            <p className="text-gray text-sm mt-1">Daftar transaksi pembelian buku Anda</p>
          </div>
          <Link to="/bookstore" className="btn btn-outline text-sm py-2 px-4 rounded-lg">
            Belanja Lagi
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-dark mb-2">Belum ada pesanan</h3>
            <p className="text-gray mb-6">Yuk mulai koleksi buku favoritmu!</p>
            <Link to="/bookstore" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition">
              Cari Buku
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Info Utama */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/5 rounded-xl hidden md:block">
                    <Package size={24} className="text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-dark">Order #{order.id}</h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Total & Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-gray-50">
                   <div className="text-right">
                      <p className="text-xs text-gray mb-0.5">Total Belanja</p>
                      <p className="font-bold text-primary text-lg">{formatCurrency(order.total_amount)}</p>
                   </div>
                   
                   {/* Tombol Bayar jika masih pending */}
                   {order.status === 'pending' ? (
                       <Link 
                         to={`/payment/qris/${order.id}`} 
                         state={{ order: { total: order.total_amount } }}
                         className="bg-orange-500 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 transition"
                       >
                         Bayar
                       </Link>
                   ) : (
                       <Link 
                        to={`/invoice/${order.id}`}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-primary hover:text-white transition-all"
                      >
                        <ArrowRight size={20} />
                      </Link>
                   )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInvoicesPage;