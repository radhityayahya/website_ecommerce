import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService"; // Hapus 'books' dari import ini
import {
  Heart,
  ShoppingCart,
  Grid3x3,
  List,
  ChevronDown,
  ChevronUp,
  Star,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import BookCard from "../../components/common/BookCard";

const BookstorePage = () => {
  const { addToCart } = useCart();
  
  // 1. Ubah 'books' menjadi State agar bisa diisi data dari API
  const [books, setBooks] = useState([]);
  
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [expandedFilters, setExpandedFilters] = useState({
    editorPicks: true,
    publisher: false,
    year: false,
    category: true,
    priceRange: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const itemsPerPage = 12;

  // 2. Tambahkan useEffect untuk mengambil data dari Backend (Database MySQL)
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/books');
        const data = await response.json();
        // Pastikan data yang diterima adalah array
        if (Array.isArray(data)) {
          setBooks(data);
        } else {
          console.error("Format data buku tidak valid:", data);
        }
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      }
    };

    fetchBooks();
  }, []); // Array kosong artinya hanya dijalankan sekali saat halaman dimuat

  const editorPicks = [
    { name: "Best Sales", count: 105 },
    { name: "Most Commented", count: 21 },
    { name: "Newest Books", count: 32 },
    { name: "Featured", count: 129 },
    { name: "Watch History", count: 21 },
    { name: "Best Books", count: 44 },
  ];

  const categories = [
    "Action",
    "Fantasy",
    "Adventure",
    "History",
    "Animation",
    "Horror",
    "Biography",
    "Mystery",
    "Comedy",
    "Romance",
    "Crime",
    "Sci-Fi",
    "Documentary",
    "Sport",
    "Novel", // Tambahkan kategori yang ada di database
    "Religi"
  ];

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleAddToCart = (e, book) => {
    e.preventDefault();
    addToCart({ ...book, quantity: 1 });
  };

  // Filter logika tetap sama, sekarang menggunakan state 'books'
  const filteredBooks = books.filter((book) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
      return false;
    }
    // Pastikan harga dikonversi ke angka jika dari database masih string
    const price = Number(book.price);
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans">
      <div className="container mx-auto max-w-[1600px] px-4 md:px-6 py-8">
        <div className="text-sm text-gray mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-dark font-medium">Books</span>
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden w-full bg-white border border-gray-200 text-dark py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-4 hover:bg-gray-50 transition-colors">
            <Filter size={20} /> Filter Books
          </button>
          <aside
            className={`
            fixed inset-0 z-50 bg-black/50 lg:bg-transparent lg:static lg:z-auto lg:col-span-3 transition-opacity duration-300
            ${
              showMobileFilters ? "opacity-100 visible" : "opacity-0 invisible lg:opacity-100 lg:visible"
            }
          `}>
            <div
              className={`
              bg-white lg:rounded-[24px] p-6 shadow-sm h-full lg:h-auto overflow-y-auto lg:overflow-visible w-[85%] max-w-[320px] lg:w-auto lg:max-w-none lg:sticky lg:top-28 border-r lg:border border-gray-100 transition-transform duration-300
              ${showMobileFilters ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
              <div className="flex items-center justify-between mb-6 lg:mb-6">
                <div className="flex items-center gap-2 text-dark">
                  <Filter size={20} />
                  <h2 className="text-xl font-bold">Filter Option</h2>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <div className="mb-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <button
                  onClick={() => toggleFilter("editorPicks")}
                  className="flex justify-between items-center w-full mb-4 hover:text-primary transition-colors">
                  <h3 className="font-bold text-[15px]">Editor Picks</h3>
                  {expandedFilters.editorPicks ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.editorPicks && (
                  <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {editorPicks.map((pick, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between text-[14px] cursor-pointer hover:text-primary py-1.5 transition-colors group">
                        <span
                          className={
                            i === 0 ? "text-primary font-medium" : "text-gray group-hover:text-dark"
                          }>
                          {pick.name}
                        </span>
                        <span className="text-gray/50 text-xs bg-gray-50 px-2 py-0.5 rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {pick.count}
                        </span>
                      </li>
                    ))}
                    <li className="text-primary text-xs font-bold cursor-pointer pt-3 hover:underline">
                      View more →
                    </li>
                  </ul>
                )}
              </div>
              <div className="mb-6 pb-6 border-b border-gray-100">
                <button
                  onClick={() => toggleFilter("publisher")}
                  className="flex justify-between items-center w-full mb-4 hover:text-primary transition-colors">
                  <h3 className="font-bold text-[15px]">Choose Publisher</h3>
                  {expandedFilters.publisher ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              <div className="mb-6 pb-6 border-b border-gray-100">
                <button
                  onClick={() => toggleFilter("year")}
                  className="flex justify-between items-center w-full mb-4 hover:text-primary transition-colors">
                  <h3 className="font-bold text-[15px]">Select Year</h3>
                  {expandedFilters.year ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              <div className="mb-6 pb-6 border-b border-gray-100">
                <button
                  onClick={() => toggleFilter("category")}
                  className="flex justify-between items-center w-full mb-4 hover:text-primary transition-colors">
                  <h3 className="font-bold text-[15px]">Shop by Category</h3>
                  {expandedFilters.category ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.category && (
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            selectedCategories.includes(cat)
                              ? "bg-primary border-primary"
                              : "border-gray-300 group-hover:border-primary"
                          }`}>
                          {selectedCategories.includes(cat) && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="hidden"
                        />
                        <span
                          className={`text-[13px] transition-colors ${
                            selectedCategories.includes(cat)
                              ? "text-primary font-medium"
                              : "text-gray group-hover:text-dark"
                          }`}>
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <div className="mb-8">
                <button
                  onClick={() => toggleFilter("priceRange")}
                  className="flex justify-between items-center w-full mb-4 hover:text-primary transition-colors">
                  <h3 className="font-bold text-[15px]">Price Range</h3>
                  {expandedFilters.priceRange ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedFilters.priceRange && (
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm font-medium text-dark mt-3 bg-gray-50 p-2 rounded-lg">
                      <span>{formatCurrency(priceRange[0])}</span>
                      <span>{formatCurrency(priceRange[1])}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 lg:border-none lg:static lg:p-0">
                <button className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all mb-3 lg:mb-0">
                  Refine Search
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 300000]);
                  }}
                  className="w-full text-gray text-sm mt-0 lg:mt-4 hover:text-danger font-medium transition-colors">
                  Reset Filter
                </button>
              </div>
            </div>
            <div className="flex-1 lg:hidden" onClick={() => setShowMobileFilters(false)}></div>
          </aside>
          <main className="col-span-12 lg:col-span-9">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div className="w-full md:w-auto">
                <h1 className="text-3xl font-extrabold mb-6 text-dark">Books Collection</h1>
                <div className="flex gap-8 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-hide">
                  {["Today", "This Week", "This Month"].map((tab) => (
                    <button
                      key={tab}
                      className={`pb-3 text-[15px] font-bold transition-all relative whitespace-nowrap ${
                        tab === "Today" ? "text-primary" : "text-gray hover:text-dark"
                      }`}>
                      {tab}
                      {tab === "Today" && (
                        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                <div className="hidden md:flex gap-1 bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === "list"
                        ? "bg-primary text-white shadow-md"
                        : "text-gray hover:bg-gray-50"
                    }`}>
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? "bg-primary text-white shadow-md"
                        : "text-gray hover:bg-gray-50"
                    }`}>
                    <Grid3x3 size={20} />
                  </button>
                </div>
                <select className="flex-1 md:flex-none pl-4 pr-10 py-3 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm hover:border-gray-300 transition-colors w-full md:w-auto">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                  <option>Best Rating</option>
                </select>
              </div>
            </div>
            
            {/* Loading State / Empty State bisa ditambahkan di sini */}
            {books.length === 0 && (
              <div className="text-center py-10 text-gray">
                Loading books from database...
              </div>
            )}

            <div
              className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-10 ${
                viewMode === "list" ? "hidden md:hidden" : ""
              }`}>
              {paginatedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {viewMode === "list" && (
              <div className="hidden md:block space-y-5 mb-10">
                {paginatedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-gray-50 flex gap-8 items-center">
                    <Link to={`/book/${book.id}`} className="w-[180px] flex-shrink-0 relative">
                      <div className="bg-gray-100 rounded-xl aspect-[2/3] overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 relative">
                        {/* Fallback image jika tidak ada gambar */}
                        <img 
                            src={book.image || "https://placehold.co/400x600?text=No+Image"} 
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {book.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md">
                            {book.discount}% OFF
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1 bg-primary/5 inline-block px-2 py-0.5 rounded-md">
                            {book.category}
                          </div>
                          <Link to={`/book/${book.id}`}>
                            <h3 className="font-bold text-2xl mb-2 text-dark group-hover:text-primary transition-colors">
                              {book.title}
                            </h3>
                          </Link>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span className="font-bold text-lg text-dark">{book.rating || 4.8}</span>
                            <Star size={18} className="fill-[#FF974A] text-[#FF974A]" />
                          </div>
                          <span className="text-xs text-gray mt-1 font-medium">
                            {book.reviews || 0} Reviews
                          </span>
                        </div>
                      </div>
                      <p className="text-[14px] text-gray leading-relaxed mb-6 line-clamp-2 max-w-2xl">
                        {book.description ||
                          "No description available."}
                      </p>
                      <div className="flex items-center gap-12 mb-6 text-sm border-y border-gray-50 py-4">
                        <div>
                          <span className="text-gray text-xs uppercase font-bold tracking-wide block mb-1">
                            Author
                          </span>
                          <span className="font-bold text-dark flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200"></div> {book.author}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray text-xs uppercase font-bold tracking-wide block mb-1">
                            Publisher
                          </span>
                          <span className="font-medium text-dark">Gramedia Pustaka</span>
                        </div>
                        <div>
                          <span className="text-gray text-xs uppercase font-bold tracking-wide block mb-1">
                            Year
                          </span>
                          <span className="font-medium text-dark">2023</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                          <span className="font-extrabold text-3xl text-dark">
                            {formatCurrency(book.price)}
                          </span>
                          {book.originalPrice && (
                            <span className="text-base text-gray line-through decoration-red-500/50">
                              {formatCurrency(book.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="w-12 h-12 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all">
                            <Heart size={22} />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(e, book)}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-2">
                            <ShoppingCart size={18} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm gap-4">
              <p className="text-sm text-gray font-medium text-center md:text-left">
                Showing{" "}
                <span className="text-dark font-bold">
                  {filteredBooks.length > 0 ? startIndex + 1 : 0}-
                  {Math.min(startIndex + itemsPerPage, filteredBooks.length)}
                </span>{" "}
                of <span className="text-dark font-bold">{filteredBooks.length}</span> books
              </p>
              <div className="flex gap-2 w-full md:w-auto justify-center">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                  Previous
                </button>
                <div className="hidden sm:flex gap-2">
                  {[...Array(Math.min(totalPages || 0, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                          currentPage === pageNum
                            ? "bg-primary text-white shadow-md transform scale-105"
                            : "text-gray hover:bg-gray-100"
                        }`}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <div className="sm:hidden flex items-center px-4 font-bold text-dark">
                  Page {currentPage}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-4 py-2 bg-primary/5 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary hover:text-white disabled:opacity-50 transition-all">
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
        <section className="mt-24 mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark">Also Featured</h2>
            <div className="flex gap-3">
              <button className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition-all">
                <ChevronLeft size={20} />
              </button>
              <button className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition-all">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {/* Tampilkan 6 buku pertama sebagai fitur */}
            {books.slice(0, 6).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookstorePage;