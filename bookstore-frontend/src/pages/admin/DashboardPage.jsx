import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { formatCurrency } from "../../services/dataService";
import { Link } from "react-router-dom";

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
        const statsRes = await fetch("http://localhost:3001/api/admin/stats");
        const statsData = await statsRes.json();
        if (statsRes.ok) {
            setStats(statsData);
        }

        // 2. Ambil Order Terbaru
        const ordersRes = await fetch("http://localhost:3001/api/admin/recent-orders");
        const ordersData = await ordersRes.json();
        
        // Anti-Crash Check
        if (Array.isArray(ordersData)) {
            setRecentOrders(ordersData);
        } else {
            setRecentOrders([]);
        }

      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { 
      label: "Total Pendapatan", 
      value: formatCurrency(stats.totalSales || 0), 
      icon: DollarSign, 
      color: "bg-green-500", 
      bg: "bg-green-50 text-green-600" 
    },
    { 
      label: "Total Pesanan", 
      value: stats.totalOrders || 0, 
      icon: ShoppingBag, 
      color: "bg-blue-500", 
      bg: "bg-blue-50 text-blue-600" 
    },
    { 
      label: "Koleksi Buku", 
      value: stats.totalBooks || 0, 
      icon: BookOpen, 
      color: "bg-purple-500", 
      bg: "bg-purple-50 text-purple-600" 
    },
    { 
      label: "Pelanggan", 
      value: stats.totalUsers || 0, 
      icon: Users, 
      color: "bg-orange-500", 
      bg: "bg-orange-50 text-orange-600" 
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-orange-100 text-orange-700",
      shipped: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700"
    };
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${styles[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-400 font-bold">Memuat Dashboard...</div>;

  return (
    <div className="space-y-8 font-sans animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-dark">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Selamat datang kembali, Admin.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
                <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                        <Icon size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                        <h3 className="text-xl font-extrabold text-dark mt-1">{stat.value}</h3>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-dark flex items-center gap-2">
                    <TrendingUp size={20} className="text-primary"/> Pesanan Terbaru
                </h3>
                <Link to="/admin/sales" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                    Lihat Semua <ArrowRight size={16}/>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Pelanggan</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-mono font-bold text-primary">#{order.id}</td>
                                <td className="px-6 py-4 font-medium text-dark">{order.user_name || "Guest"}</td>
                                <td className="px-6 py-4 font-bold">{formatCurrency(order.total_amount)}</td>
                                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">Belum ada transaksi.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Right: Quick Actions / Banner */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Kelola Produk</h3>
                    <p className="text-white/80 text-sm mb-6">Tambah buku baru atau update stok untuk meningkatkan penjualan.</p>
                    <Link to="/admin/products" className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-50 transition inline-block">
                        + Tambah Produk
                    </Link>
                </div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <BookOpen size={64}/>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-dark mb-4">Status Toko</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-600">Server Status</span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-600">Database</span>
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Connected</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;