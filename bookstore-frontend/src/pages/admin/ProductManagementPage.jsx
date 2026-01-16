// src/pages/admin/ProductManagementPage.jsx

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, X, Save, Image as ImageIcon, UploadCloud } from "lucide-react";
import { formatCurrency } from "../../services/dataService";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../../components/ui/ConfirmationModal";

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [uploading, setUploading] = useState(false); // State loading upload
  const toast = useToast();

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    author: "",
    price: "",
    category: "Novel",
    image: "", // Ini akan berisi URL gambar (baik dari upload atau link manual)
    description: "",
    discount: 0,
    rating: 4.5
  });

  const categories = ["Novel", "Komik", "Pendidikan", "Teknologi", "Biografi", "Anak", "Religi"];

  // Fetch Data (Sama seperti sebelumnya)
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/books");
      const data = await response.json();
      setProducts(data.sort((a, b) => b.id - a.id));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- FUNGSI BARU: HANDLE UPLOAD FILE ---
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      
      if (result.success) {
        setFormData({ ...formData, image: result.url }); // Simpan URL dari server ke form
        toast.success("Gambar berhasil diupload!");
      } else {
        toast.error("Gagal upload gambar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error server saat upload");
    } finally {
      setUploading(false);
    }
  };
  // ----------------------------------------

  const resetForm = () => {
    setFormData({
      id: null, title: "", author: "", price: "", category: "Novel",
      image: "", description: "", discount: 0, rating: 4.5
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
    setShowModal(true);
  };

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
        fetchProducts();
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan server");
    }
  };

  const handleDelete = async () => {
    try {
        await fetch(`http://localhost:3001/api/books/${deleteModal.id}`, { method: "DELETE" });
        toast.success("Buku dihapus");
        fetchProducts();
    } catch (error) { toast.error("Gagal hapus"); } 
    finally { setDeleteModal({ isOpen: false, id: null }); }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Hapus Buku"
        message="Yakin ingin menghapus? Data tidak bisa dikembalikan."
        confirmText="Hapus"
        cancelText="Batal"
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Manajemen Produk</h1>
          <p className="text-gray-500 text-sm">Upload dan kelola katalog buku</p>
        </div>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 shadow-lg">
          <Plus size={20} /> Tambah Buku
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search size={20} className="text-gray-400" />
        <input type="text" placeholder="Cari judul atau penulis..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 outline-none text-dark" />
      </div>

      {/* Product List Table (Sama seperti sebelumnya, disingkat) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Produk</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Harga</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase">Aksi</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 flex items-center gap-4">
                            <img src={product.image} alt={product.title} className="w-10 h-14 object-cover rounded bg-gray-200"/>
                            <div>
                                <div className="font-bold text-dark">{product.title}</div>
                                <div className="text-xs text-gray-500">{product.category}</div>
                            </div>
                        </td>
                        <td className="py-4 px-6 font-medium">{formatCurrency(product.price)}</td>
                        <td className="py-4 px-6 text-right">
                            <button onClick={() => handleEdit(product)} className="text-blue-600 mr-3"><Edit size={18}/></button>
                            <button onClick={() => setDeleteModal({isOpen:true, id:product.id})} className="text-red-500"><Trash2 size={18}/></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-dark">{isEditing ? "Edit Buku" : "Tambah Buku Baru"}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="label">Judul</label><input name="title" value={formData.title} onChange={handleChange} className="input-field" required /></div>
                <div><label className="label">Penulis</label><input name="author" value={formData.author} onChange={handleChange} className="input-field" required /></div>
                <div><label className="label">Harga</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="input-field" required /></div>
                <div>
                    <label className="label">Kategori</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>

              {/* INPUT GAMBAR BARU */}
              <div>
                <label className="label">Gambar Buku</label>
                <div className="flex gap-4 items-start">
                    {/* Preview */}
                    <div className="w-24 h-32 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        {formData.image ? (
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="text-gray-400" />
                        )}
                        {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">Uploading...</div>}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        {/* Pilihan 1: Upload File */}
                        <div className="relative">
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 hover:bg-blue-100 transition cursor-pointer font-bold text-sm justify-center">
                                <UploadCloud size={18}/> Upload Foto dari Komputer
                            </div>
                        </div>
                        
                        {/* Pilihan 2: URL Manual (Opsional) */}
                        <input 
                            type="text" 
                            name="image" 
                            placeholder="Atau tempel URL gambar di sini..."
                            value={formData.image} 
                            onChange={handleChange} 
                            className="input-field text-sm"
                        />
                    </div>
                </div>
              </div>

              <div><label className="label">Deskripsi</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input-field"></textarea></div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={resetForm} className="btn-secondary">Batal</button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                    <Save size={18} /> {uploading ? "Menunggu..." : "Simpan Buku"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`.label { display:block; font-size: 0.875rem; font-weight: 700; color: #374151; margin-bottom: 0.5rem; } .input-field { width: 100%; px: 1rem; py: 0.75rem; background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 0.75rem; outline: none; transition: all 0.2s; } .input-field:focus { border-color: #4A5FFF; background-color: white; } .btn-primary { padding: 0.625rem 1.5rem; background-color: #4A5FFF; color: white; border-radius: 0.75rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; } .btn-primary:hover { background-color: #3D4FE6; } .btn-secondary { padding: 0.625rem 1.5rem; border: 1px solid #E5E7EB; color: #6B7280; border-radius: 0.75rem; font-weight: bold; transition: all 0.2s; } .btn-secondary:hover { background-color: #F3F4F6; }`}</style>
    </div>
  );
};

export default ProductManagementPage;