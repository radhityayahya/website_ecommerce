import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatCurrency } from "../../services/dataService";
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, Search } from "lucide-react";

const UserInvoicesPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/user/${user.id}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Gagal mengambil riwayat:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered": return "bg-purple-100 text-purple-700 border-purple-200";
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
        case "paid": return <CheckCircle size={16}/>;
        case "shipped": return <Truck size={16}/>;
        case "pending": return <Clock size={16}/>;
        case "cancelled": return <XCircle size={16}/>;
        default: return <Package size={16}/>;
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat riwayat...</div>;

  return (
    <div className="bg-[#FCFCFD] min-h-screen py-8 font-sans">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
                <Package className="text-primary"/> Riwayat Pesanan
            </h1>
        </div>

        {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={24}/>
                </div>
                <h3 className="font-bold text-dark text-lg">Belum ada pesanan</h3>
                <p className="text-gray-500 mb-6">Yuk mulai belanja buku favoritmu!</p>
                <Link to="/bookstore" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-opacity-90">
                    Cari Buku
                </Link>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-mono font-bold text-dark">#{order.id}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase border w-fit ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)} {order.status}
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-xs text-gray-500 mb-1">Total Belanja</p>
                                <p className="text-lg font-bold text-primary">{formatCurrency(order.total_amount)}</p>
                            </div>
                        </div>
                        
                        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                            <span className="text-xs text-gray-400 font-medium">Metode Pembayaran: {order.payment_method?.toUpperCase()}</span>
                            
                            <Link to={`/invoice/${order.id}`} className="text-sm font-bold text-dark flex items-center gap-1 hover:text-primary transition group-hover:translate-x-1">
                                Lihat Detail <ChevronRight size={16}/>
                            </Link>
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