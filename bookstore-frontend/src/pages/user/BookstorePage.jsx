import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Star,
  BookOpen,
  X
} from "lucide-react";

const BookStorePage = () => {
  // --- STATE & CONTEXT ---
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // --- 1. FETCH DATA DARI DATABASE ---
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/books");
        const data = await response.json();
        if (Array.isArray(data)) {
            setBooks(data);
            setFilteredBooks(data);
        }
      } catch (error) {
        console.error("Gagal mengambil buku:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // --- 2. LOGIKA FILTER & PENCARIAN ---
  useEffect(() => {
    let result = books;

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (book) => book.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    setFilteredBooks(result);
  }, [books, searchQuery, selectedCategory]);

  // Ambil list kategori unik dari data buku
  const categories = ["All", ...new Set(books.map((b) => b.category).filter(Boolean))];

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans pb-12">
      
      {/* HEADER & SEARCH */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto max-w-[1400px] px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-extrabold text-dark flex items-center gap-2">
              <BookOpen className="text-primary"/> Katalog Buku
            </h1>
            
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Cari judul buku atau penulis..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              {searchQuery && (
                <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                    <X size={16}/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-[1400px] px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR FILTER (Kategori) */}
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-dark font-bold border-b border-gray-100 pb-4">
                <Filter size={20} /> Kategori
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT (Grid Buku) */}
          <div className="col-span-1 lg:col-span-9">
            
            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 h-80 animate-pulse border border-gray-100">
                            <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                            <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredBooks.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Search size={32}/>
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-2">Buku tidak ditemukan</h3>
                    <p className="text-gray-500">Coba kata kunci lain atau ubah kategori.</p>
                    <button 
                        onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                        className="mt-6 text-primary font-bold hover:underline"
                    >
                        Reset Filter
                    </button>
                </div>
            )}

            {/* Book Grid */}
            {!loading && filteredBooks.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                    <div
                    key={book.id}
                    className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                    >
                    {/* Gambar Buku */}
                    <div className="relative aspect-[2/3] bg-gray-200 rounded-xl overflow-hidden mb-4">
                        <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Cover"; }}
                        />
                        
                        {/* Overlay Buttons */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                            <button
                                onClick={() => addToWishlist(book)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition ${
                                    isInWishlist(book.id) ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-500"
                                }`}
                            >
                                <Heart size={16} className={isInWishlist(book.id) ? "fill-current" : ""} />
                            </button>
                        </div>

                        {/* Stok Label */}
                        {book.stock <= 5 && book.stock > 0 && (
                            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                                Sisa {book.stock}
                            </div>
                        )}
                    </div>

                    {/* Info Buku */}
                    <Link to={`/book/${book.id}`} className="block flex-1">
                        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wide">
                            {book.category}
                        </div>
                        <h3 className="font-bold text-dark text-sm md:text-base leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {book.title}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">{book.author}</p>
                    </Link>

                    {/* Harga & Action */}
                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                        <div className="font-extrabold text-primary text-lg">
                            {formatCurrency(book.price)}
                        </div>
                        <button
                            onClick={() => addToCart({ ...book, quantity: 1 })}
                            className="w-9 h-9 rounded-full bg-gray-100 text-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
                            disabled={book.stock === 0}
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookstorePage;