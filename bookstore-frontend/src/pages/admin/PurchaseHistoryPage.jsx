import { useState, useEffect } from "react";
import { formatCurrency } from "../../services/dataService";
import { Plus, Search, Calendar, Package, User, Trash2, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const PurchaseHistoryPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [books, setBooks] = useState([]); // Untuk dropdown pilihan buku
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  // State Form Restock
  const [formData, setFormData] = useState({
    supplier: "",
    bookId: "",
    qty: "",
    cost: ""
  });

  // Fetch Data Awal
  const fetchData = async () => {
    try {
      // Ambil Riwayat
      const resPurchases = await fetch("http://localhost:3001/api/admin/purchases");
      const dataPurchases = await resPurchases.json();
      setPurchases(dataPurchases);

      // Ambil Daftar Buku (untuk dropdown)
      const resBooks = await fetch("http://localhost:3001/api/books");
      const dataBooks = await resBooks.json();
      setBooks(dataBooks);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Submit Form Restock
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bookId || !formData.qty || !formData.cost) {
      toast.error("Mohon lengkapi data barang");
      return;
    }

    try {
      const payload = {
        supplier: formData.supplier || "Umum",
        items: [
          {
            bookId: parseInt(formData.bookId),
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
        fetchData(); // Refresh tabel
      } else {
        toast.error(result.message);
      }

    } catch (error) {
      console.error("Error restock:", error);
      toast.error("Gagal menambah stok");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Riwayat Kulakan (Stok)</h1>
          <p className="text-gray text-sm">Catat pembelian barang masuk dari supplier</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> Tambah Stok (Restock)
        </button>
      </div>

      {/* Tabel Riwayat */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">ID Transaksi</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Supplier</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Tanggal</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray uppercase">Total Item</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray uppercase">Total Biaya</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Memuat data...</td></tr>
              ) : purchases.length > 0 ? (
                purchases.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-mono font-medium text-dark">
                      PUR-{item.id}
                    </td>
                    <td className="py-4 px-6 font-medium text-dark">
                      {item.supplier_name}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                         day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                        {item.total_items} Pcs
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-dark">
                      {formatCurrency(item.total_cost)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="5" className="text-center py-10 text-gray">Belum ada riwayat pembelian stok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Restock */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-dark">Tambah Stok Buku</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray mb-2">Nama Supplier</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" size={18}/>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none"
                        placeholder="Contoh: Penerbit Erlangga / Gramedia"
                        value={formData.supplier}
                        onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray mb-2">Pilih Buku</label>
                <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none"
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
                    <label className="block text-sm font-bold text-gray mb-2">Jumlah (Qty)</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none"
                        placeholder="0"
                        value={formData.qty}
                        onChange={(e) => setFormData({...formData, qty: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray mb-2">Harga Beli / Pcs</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none"
                        placeholder="Rp 0"
                        value={formData.cost}
                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                        required
                    />
                </div>
              </div>

              <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm">
                <span className="font-bold">Info:</span> Stok buku yang dipilih akan bertambah otomatis setelah disimpan.
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-primary/20"
                >
                  Simpan & Tambah Stok
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