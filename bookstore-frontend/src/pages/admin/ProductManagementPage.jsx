import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Save, Image as ImageIcon } from "lucide-react";
import { formatCurrency } from "../../services/dataService";
import { useToast } from "../../context/ToastContext"; // Pastikan path import benar
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const toast = useToast();

  // State untuk Form Input
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    author: "",
    price: "",
    category: "Novel",
    image: "",
    description: "",
    discount: 0,
    rating: 4.5
  });

  const categories = ["Novel", "Komik", "Pendidikan", "Teknologi", "Biografi", "Anak", "Religi"];

  // 1. Ambil Data Buku dari Database
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/books");
      const data = await response.json();
      // Urutkan dari yang terbaru (ID terbesar)
      setProducts(data.sort((a, b) => b.id - a.id));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Gagal mengambil data buku");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler Input Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      author: "",
      price: "",
      category: "Novel",
      image: "",
      description: "",
      discount: 0,
      rating: 4.5
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setShowModal(true);
  };

  // 2. Simpan Data (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = isEditing 
        ? `http://localhost:3001/api/books/${formData.id}`
        : "http://localhost:3001/api/books";
    
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        fetchProducts(); // Refresh data tabel
        resetForm();
      } else {
        toast.error(result.message || "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("Terjadi kesalahan server");
    }
  };

  // 3. Hapus Data
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/books/${deleteModal.id}`, {
        method: "DELETE"
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Buku berhasil dihapus");
        fetchProducts();
      } else {
        toast.error(result.message || "Gagal menghapus buku");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  // Filter Search
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Modal Konfirmasi Hapus */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Buku"
        message="Apakah Anda yakin ingin menghapus buku ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
      />

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Manajemen Produk</h1>
          <p className="text-gray text-sm">Kelola katalog buku toko Anda</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 transition shadow-lg shadow-primary/20">
          <Plus size={20} /> Tambah Buku
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-gray" />
        <input
          type="text"
          placeholder="Cari berdasarkan judul atau penulis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-dark placeholder:text-gray"
        />
      </div>

      {/* Tabel Produk */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Produk</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Kategori</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Harga</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray uppercase">Diskon</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8">Memuat data...</td></tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                           <img 
                            src={product.image || "https://placehold.co/400x600?text=No+Img"} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                           />
                        </div>
                        <div>
                          <h4 className="font-bold text-dark line-clamp-1">{product.title}</h4>
                          <p className="text-xs text-gray">{product.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-dark">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-4 px-6">
                      {product.discount > 0 ? (
                        <span className="text-red-500 font-bold">{product.discount}%</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: product.id })}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan="5" className="text-center py-10 text-gray">Tidak ada buku ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-dark">
                {isEditing ? "Edit Buku" : "Tambah Buku Baru"}
              </h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray mb-2">Judul Buku</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition"
                    placeholder="Contoh: Laskar Pelangi"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray mb-2">Penulis</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition"
                    placeholder="Nama Penulis"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray mb-2">Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray mb-2">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition cursor-pointer"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray mb-2">Rating (0-5)</label>
                    <input
                        type="number"
                        step="0.1"
                        max="5"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-bold text-gray mb-2">Diskon (%)</label>
                    <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray mb-2">URL Gambar Cover</label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" size={18}/>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none"
                            placeholder="https://example.com/gambar-buku.jpg"
                        />
                    </div>
                </div>
                <p className="text-xs text-gray mt-1">*Masukkan link gambar (URL) yang valid.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray mb-2">Deskripsi Buku</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary focus:bg-white outline-none transition"
                  placeholder="Sinopsis singkat buku..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl font-bold text-gray hover:bg-gray-50 transition">
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 transition flex items-center gap-2">
                  <Save size={18} /> Simpan Buku
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;