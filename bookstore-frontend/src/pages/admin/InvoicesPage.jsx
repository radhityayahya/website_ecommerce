import { useState, useEffect } from "react";
import { FileText, Download, Search, Printer, Eye, AlertCircle } from "lucide-react";
import { formatCurrency } from "../../services/dataService";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/admin/invoices");
        const data = await response.json();

        // 1. PENCEGAHAN CRASH: Cek apakah data benar-benar Array
        if (Array.isArray(data)) {
            setInvoices(data);
        } else {
            console.error("Format data salah (Bukan Array):", data);
            setInvoices([]); // Set kosong agar tidak crash
            // Opsional: Tampilkan pesan jika backend mengirim error
            if (data.message) setErrorMsg(data.message);
        }
      } catch (error) {
        console.error("Gagal mengambil invoice:", error);
        setErrorMsg("Gagal terhubung ke server.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // 2. PENCEGAHAN CRASH: Handle field yang mungkin NULL di database
  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    
    // Pastikan ID ada sebelum di-string
    const idMatch = inv.id ? inv.id.toString().includes(term) : false;
    
    // PENTING: Gunakan ( ... || '') untuk menangani nama yang NULL
    const nameMatch = (inv.customer_name || '').toLowerCase().includes(term);
    
    return idMatch || nameMatch;
  });

  const handlePrint = () => {
    window.print();
  };

  // Tampilan Error (Jika ada masalah koneksi/data)
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
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-dark">Arsip Faktur</h1>
          <p className="text-gray-500 text-sm">Dokumen pesanan yang telah lunas (Paid/Shipped/Delivered).</p>
        </div>
        <button 
            onClick={handlePrint}
            className="bg-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 shadow-lg transition"
        >
            <Printer size={18}/> Cetak Laporan
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 print:hidden">
        <Search size={20} className="text-gray-400" />
        <input 
            type="text" 
            placeholder="Cari No. Faktur atau Nama Pelanggan..." 
            className="flex-1 outline-none text-sm font-medium text-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Invoice List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden print:shadow-none print:border-none">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">No. Faktur</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Pelanggan</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Tanggal</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-right whitespace-nowrap">Total</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-center print:hidden">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="6" className="py-8 text-center text-gray-400">Memuat data...</td></tr>
                    ) : filteredInvoices.length === 0 ? (
                        <tr><td colSpan="6" className="py-8 text-center text-gray-400">Belum ada faktur yang lunas.</td></tr>
                    ) : (
                        filteredInvoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-6 font-mono font-bold text-primary">INV-{inv.id}</td>
                                <td className="py-4 px-6">
                                    {/* Gunakan fallback string kosong jika data null */}
                                    <div className="font-bold text-dark text-sm">{inv.customer_name || 'Guest'}</div>
                                    <div className="text-xs text-gray-400">{inv.email || '-'}</div>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '-'}
                                </td>
                                <td className="py-4 px-6">
                                    <span className="bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-md text-xs font-bold uppercase">
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right font-bold text-dark">
                                    {formatCurrency(inv.total_amount)}
                                </td>
                                <td className="py-4 px-6 text-center print:hidden">
                                    <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition">
                                        <Eye size={18}/>
                                    </button>
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

export default InvoicesPage;