import { useState, useEffect } from "react";
import { formatCurrency } from "../../services/dataService";
import { useToast } from "../../context/ToastContext";
import { 
  Search, 
  Filter, 
  AlertCircle
} from "lucide-react";

const SalesHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [errorMsg, setErrorMsg] = useState(null); // State untuk error
  const toast = useToast();

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/admin/orders");
      const data = await response.json();
      
      // 1. PENGAMAN: Cek apakah data benar-benar Array
      if (Array.isArray(data)) {
          setOrders(data);
      } else {
          console.error("Format data salah:", data);
          setOrders([]); // Set array kosong agar tidak crash
          if (data.message) setErrorMsg(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
        const response = await fetch(`http://localhost:3001/api/admin/orders/${orderId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            toast.success(`Status order #${orderId} diubah ke ${newStatus}`);
            fetchOrders(); 
        } else {
            toast.error("Gagal update status");
        }
    } catch (error) {
        toast.error("Error koneksi");
    }
  };

  // 2. PENGAMAN FILTER: Handle data null saat pencarian
  const filteredOrders = orders.filter(order => {
    const term = searchTerm.toLowerCase();
    
    // Pastikan field ada sebelum diolah
    const idMatch = order.id ? order.id.toString().includes(term) : false;
    const nameMatch = (order.customer_name || '').toLowerCase().includes(term);
    
    const matchSearch = idMatch || nameMatch;
    const matchStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-orange-100 text-orange-700 border-orange-200",
      shipped: "bg-blue-100 text-blue-700 border-blue-200",
      delivered: "bg-purple-100 text-purple-700 border-purple-200",
      cancelled: "bg-red-100 text-red-700 border-red-200"
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${styles[status] || "bg-gray-100"}`}>
        {status}
      </span>
    );
  };

  // Tampilan Error
  if (errorMsg) {
      return (
          <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 rounded-2xl border border-red-100 p-6 animate-fade-in">
              <AlertCircle size={48} className="mb-4" />
              <h3 className="font-bold text-lg">Oops! Terjadi Masalah</h3>
              <p>{errorMsg}</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Riwayat Penjualan</h1>
          <p className="text-gray-500 text-sm">Kelola pesanan masuk dan update status pengiriman.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input 
                type="text" 
                placeholder="Cari ID Pesanan atau Nama Pelanggan..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter size={18} className="text-gray-400"/>
            {["all", "pending", "paid", "shipped"].map(status => (
                <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${statusFilter === status ? "bg-dark text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                >
                    {status}
                </button>
            ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Order ID</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Pelanggan</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Tanggal</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Total</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-right whitespace-nowrap">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="6" className="py-8 text-center text-gray-400">Memuat data...</td></tr>
                    ) : filteredOrders.length === 0 ? (
                        <tr><td colSpan="6" className="py-8 text-center text-gray-400">Belum ada data pesanan.</td></tr>
                    ) : (
                        filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-6 font-mono font-bold text-primary">#{order.id}</td>
                                <td className="py-4 px-6">
                                    <div className="font-bold text-dark text-sm">{order.customer_name || 'Guest'}</div>
                                    <div className="text-xs text-gray-400">{order.email || '-'}</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                                </td>
                                <td className="py-4 px-6 font-bold text-dark">
                                    {formatCurrency(order.total_amount)}
                                </td>
                                <td className="py-4 px-6">
                                    {getStatusBadge(order.status)}
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <select 
                                            className="bg-gray-100 text-xs font-bold p-2 rounded-lg border-none outline-none cursor-pointer hover:bg-gray-200"
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistoryPage;