import { useState, useEffect } from "react";
import { formatCurrency } from "../../services/dataService";
import { Plus, Search, Calendar, Package, User, Trash2, X, Save } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const PurchaseHistoryPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [books, setBooks] = useState([]); // Data buku untuk dropdown
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  // Form State
  const [formData, setFormData] = useState({
    supplier: "",
    bookId: "",
    qty: "",
    cost: ""
  });

  // 1. Fetch Data Pembelian & Daftar Buku
  const fetchData = async () => {
    try {
      const [resPurchases, resBooks] = await Promise.all([
        fetch("http://localhost:3001/api/admin/purchases"),
        fetch("http://localhost:3001/api/books")
      ]);

      const dataPurchases = await resPurchases.json();
      const dataBooks = await resBooks.json();

      if (Array.isArray(dataPurchases)) setPurchases(dataPurchases);
      if (Array.isArray(dataBooks)) setBooks(dataBooks);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handle Submit Restock
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bookId || !formData.qty || !formData.cost) {
        toast.error("Mohon lengkapi data stok");
        return;
    }

    try {
        const payload = {
            supplier: formData.supplier || "Umum",
            items: [
                { 
                    bookId: formData.bookId, 
                    qty: parseInt(formData.qty), 
                    cost: parseInt(formData.cost) 
                }
            ]
        };

        const response = await fetch("http://localhost:3001/api/admin/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (result.success) {
            toast.success("Stok berhasil ditambahkan!");
            setShowModal(false);
            setFormData({ supplier: "", bookId: "", qty: "", cost: "" });
            fetchData(); // Refresh tabel dan stok
        } else {
            toast.error("Gagal menambah stok");
        }
    } catch (error) {
        toast.error("Error koneksi server");
    }
  };

  const filteredPurchases = purchases.filter(p =>
    p.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Stok & Kulakan</h1>
          <p className="text-gray-500 text-sm">Riwayat pembelian stok dari supplier.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 shadow-lg shadow-primary/30 transition">
          <Plus size={20} /> Catat Pembelian Baru
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input 
            type="text" 
            placeholder="Cari Supplier atau ID..." 
            className="flex-1 outline-none text-sm text-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">ID</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Tanggal</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Supplier</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase">Item</th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase text-right">Total Biaya</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {loading ? (
                        <tr><td colSpan="5" className="py-8 text-center text-gray-400">Memuat data...</td></tr>
                    ) : filteredPurchases.length === 0 ? (
                        <tr><td colSpan="5" className="py-8 text-center text-gray-400">Belum ada riwayat pembelian stok.</td></tr>
                    ) : (
                        filteredPurchases.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-6 font-mono font-bold text-primary">#{p.id}</td>
                                <td className="py-4 px-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400"/>
                                        {new Date(p.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="py-4 px-6 font-medium text-dark">{p.supplier_name}</td>
                                <td className="py-4 px-6 text-sm">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold text-xs border border-blue-100">
                                        {p.total_items} Pcs
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right font-bold text-dark">{formatCurrency(p.total_cost)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* MODAL TAMBAH STOK */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-dark">Tambah Stok Buku</h3>
                    <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition">
                        <X size={20}/>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama Supplier</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                            placeholder="Contoh: Penerbit Gramedia"
                            value={formData.supplier}
                            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Pilih Buku</label>
                        <select 
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                            value={formData.bookId}
                            onChange={(e) => setFormData({...formData, bookId: e.target.value})}
                            required
                        >
                            <option value="">-- Pilih Buku --</option>
                            {books.map(b => (
                                <option key={b.id} value={b.id}>{b.title} (Sisa Stok: {b.stock || 0})</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Jumlah (Pcs)</label>
                            <input 
                                type="number" 
                                min="1"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                placeholder="0"
                                value={formData.qty}
                                onChange={(e) => setFormData({...formData, qty: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Harga Beli Satuan</label>
                            <input 
                                type="number" 
                                min="0"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                                placeholder="Rp"
                                value={formData.cost}
                                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg shadow-primary/20">
                            Simpan Stok
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryPage;