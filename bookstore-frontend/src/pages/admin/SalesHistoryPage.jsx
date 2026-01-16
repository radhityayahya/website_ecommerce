import { useState, useEffect } from "react";
import { formatCurrency } from "../../services/dataService";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Clock, 
  MoreHorizontal 
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import { Link } from "react-router-dom";

const SalesHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const toast = useToast();

  // Ambil Data Pesanan dari API
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/admin/orders");
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Gagal mengambil data pesanan");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fungsi Update Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(result.message);
        fetchOrders(); // Refresh data agar tampilan update
      } else {
        toast.error("Gagal mengubah status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Terjadi kesalahan server");
    }
  };

  // Filter Logika
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) || 
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Riwayat Penjualan</h1>
          <p className="text-gray text-sm">Kelola status pesanan pelanggan</p>
        </div>
        <div className="flex gap-3">
            <div className="relative">
                <select 
                    className="appearance-none bg-white border border-gray-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold focus:outline-none cursor-pointer hover:border-primary transition"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid (Dibayar)</option>
                    <option value="shipped">Shipped (Dikirim)</option>
                    <option value="delivered">Delivered (Selesai)</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray pointer-events-none" />
            </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-gray" />
        <input
          type="text"
          placeholder="Cari ID Pesanan atau Nama Pelanggan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-dark placeholder:text-gray"
        />
      </div>

      {/* Tabel Pesanan */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Order ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Pelanggan</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Tanggal</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Total</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Status Saat Ini</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Memuat data pesanan...</td></tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-mono font-medium text-dark">#{order.id}</td>
                    <td className="py-4 px-6">
                        <div className="font-bold text-dark">{order.customer_name || "Guest"}</div>
                        <div className="text-xs text-gray">{order.email}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray font-medium">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                    </td>
                    <td className="py-4 px-6 font-bold text-primary">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="relative inline-block w-40">
                         <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-xs font-bold cursor-pointer hover:border-primary focus:outline-none focus:border-primary transition"
                         >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                         </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <MoreHorizontal size={14} />
                         </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="6" className="text-center py-10 text-gray">Tidak ada pesanan yang cocok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistoryPage;