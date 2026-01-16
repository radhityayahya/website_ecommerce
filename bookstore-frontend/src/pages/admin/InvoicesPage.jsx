import { useState, useEffect } from "react";
import { formatCurrency } from "../../services/dataService";
import { Search, Printer, FileText, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/admin/invoices");
        const data = await response.json();
        setInvoices(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Gagal mengambil data invoice");
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Filter Pencarian
  const filteredInvoices = invoices.filter((inv) =>
    inv.id.toString().includes(searchTerm) ||
    inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Data Invoice</h1>
          <p className="text-gray text-sm">Arsip faktur pesanan yang sudah dibayar</p>
        </div>
        <button className="bg-white border border-gray-200 text-dark px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition flex items-center gap-2">
            <Download size={18} /> Export Laporan
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-gray" />
        <input
          type="text"
          placeholder="Cari No. Invoice atau Nama Pelanggan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-dark placeholder:text-gray"
        />
      </div>

      {/* Tabel Invoice */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">No. Invoice</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Pelanggan</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Tanggal Terbit</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Total</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Status</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Memuat data...</td></tr>
              ) : filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                            <FileText size={16} className="text-primary" />
                            <span className="font-mono font-bold text-dark">INV-{inv.id}</span>
                        </div>
                    </td>
                    <td className="py-4 px-6">
                        <div className="font-bold text-dark">{inv.customer_name}</div>
                        <div className="text-xs text-gray">{inv.email}</div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray">
                        {new Date(inv.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                    </td>
                    <td className="py-4 px-6 font-bold text-dark">
                      {formatCurrency(inv.total_amount)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        {/* Tombol Lihat Detail (Membuka Invoice User View di Tab Baru) */}
                        <Link 
                            to={`/invoice/${inv.id}`} 
                            target="_blank"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </Link>
                        {/* Tombol Print Cepat */}
                        <button
                          onClick={() => window.open(`/invoice/${inv.id}`, '_blank').print()}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Cetak Invoice"
                        >
                          <Printer size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="6" className="text-center py-10 text-gray">Tidak ada invoice ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;