import { useEffect, useState } from "react";
import { formatCurrency } from "../../services/dataService";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  BookOpen, 
  DollarSign,
  Package
} from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalBooks: 0,
    totalUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Ambil Statistik
        const statsRes = await fetch('http://localhost:3001/api/admin/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // 2. Ambil Order Terbaru
        const ordersRes = await fetch('http://localhost:3001/api/admin/recent-orders');
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData);
        
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { 
      label: "Total Penjualan", 
      value: formatCurrency(stats.totalSales), 
      icon: DollarSign, 
      color: "bg-green-500",
      trend: "+12.5%" 
    },
    { 
      label: "Total Pesanan", 
      value: stats.totalOrders, 
      icon: ShoppingBag, 
      color: "bg-blue-500",
      trend: "+8.2%" 
    },
    { 
      label: "Total Produk", 
      value: stats.totalBooks, 
      icon: BookOpen, 
      color: "bg-purple-500",
      trend: "+2.4%" 
    },
    { 
      label: "Pelanggan", 
      value: stats.totalUsers, 
      icon: Users, 
      color: "bg-orange-500",
      trend: "+5.1%" 
    },
  ];

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

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Memuat Data Dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dark">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Ringkasan aktivitas toko buku Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-600">Live Update</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-opacity-20 ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                  <TrendingUp size={14} /> {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-dark">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-dark">Pesanan Terbaru</h3>
            <button className="text-primary text-sm font-bold hover:underline">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6 font-mono font-medium text-dark">#{order.id}</td>
                    <td className="py-4 px-6">
                        <div className="font-bold text-dark text-sm">{order.user_name || "Guest"}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                        {formatCurrency(order.total_amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                    <tr>
                        <td colSpan="4" className="text-center py-12 text-gray-400">Belum ada pesanan masuk.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="bg-gradient-to-br from-primary to-[#3D4FE6] text-white rounded-2xl p-8 shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <h3 className="font-bold text-2xl mb-3">Admin Tips</h3>
                <p className="text-white/80 text-sm mb-8 leading-relaxed">
                    Pastikan stok buku selalu terupdate. Cek notifikasi pesanan "Pending" dan segera proses pengiriman untuk kepuasan pelanggan.
                </p>
            </div>
            <button className="relative z-10 bg-white text-primary px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-opacity-90 transition w-full flex items-center justify-center gap-2 shadow-lg">
                <Package size={18}/> Kelola Produk Sekarang
            </button>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;