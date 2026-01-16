import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ArrowRight,
  User,
  MessageSquare,
  Share2
} from "lucide-react";

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, checkItemExists } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const toast = useToast();

  // --- STATE DATA (Dari Database) ---
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE UI ---
  const [activeTab, setActiveTab] = useState("details");
  const [quantity, setQuantity] = useState(1);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  // 1. FETCH DATA (Saat halaman dibuka)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // A. Ambil Detail Buku
        const bookRes = await fetch(`http://localhost:3001/api/books/${id}`);
        if (!bookRes.ok) throw new Error("Buku tidak ditemukan");
        const bookData = await bookRes.json();
        setBook(bookData);

        // B. Ambil Review Buku
        const reviewRes = await fetch(`http://localhost:3001/api/books/${id}/reviews`);
        const reviewData = await reviewRes.json();
        setReviews(reviewData);

        // C. Ambil Rekomendasi (Buku lain kategori sama)
        const allRes = await fetch(`http://localhost:3001/api/books`);
        const allData = await allRes.json();
        const related = allData
            .filter((b) => b.category === bookData.category && b.id !== bookData.id)
            .slice(0, 4); // Ambil 4 buku
        setRelatedBooks(related);

      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // 2. FUNGSI KIRIM REVIEW
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
        toast.error("Silakan login untuk memberi ulasan");
        navigate("/login");
        return;
    }
    setSubmittingReview(true);
    try {
        const response = await fetch("http://localhost:3001/api/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                bookId: id,
                rating: reviewForm.rating,
                comment: reviewForm.comment
            })
        });
        const result = await response.json();
        if (result.success) {
            toast.success("Ulasan berhasil dikirim!");
            setReviewForm({ rating: 5, comment: "" });
            // Refresh reviews
            const newReviews = await (await fetch(`http://localhost:3001/api/books/${id}/reviews`)).json();
            setReviews(newReviews);
        }
    } catch (error) {
        toast.error("Gagal mengirim ulasan");
    } finally {
        setSubmittingReview(false);
    }
  };

  // 3. FUNGSI KERANJANG
  const handleAddToCart = () => {
    if (checkItemExists(book.id)) { setShowDuplicateModal(true); return; }
    confirmAddToCart();
  };

  const confirmAddToCart = () => {
    addToCart({ ...book, quantity });
    toast.success("Berhasil masuk keranjang!");
    setShowDuplicateModal(false);
  };

  // Helper Bintang
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} size={16} className={`${i < Math.round(rating) ? "fill-[#FF974A] text-[#FF974A]" : "text-gray-300"}`} />
    ));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">Memuat Buku...</div>;
  if (!book) return <div className="min-h-screen flex items-center justify-center">Buku tidak ditemukan.</div>;

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans">
      <ConfirmationModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onConfirm={confirmAddToCart}
        title="Item Sudah Ada"
        message="Buku ini sudah ada di keranjang. Tambah lagi?"
        confirmText="Ya, Tambah"
        cancelText="Batal"
      />
      
      <div className="container mx-auto max-w-[1600px] px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary">Home</Link> / 
          <Link to="/bookstore" className="hover:text-primary"> Books</Link> /
          <span className="text-dark font-medium"> {book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content (Kiri) */}
          <div className="col-span-1 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
              {/* Image Section */}
              <div className="col-span-1 md:col-span-5 lg:col-span-4">
                <div className="bg-gray-200 rounded-2xl aspect-[2/3] w-full shadow-lg overflow-hidden relative group">
                  <img 
                    src={book.image || "https://placehold.co/400x600?text=No+Cover"} 
                    alt={book.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = "https://placehold.co/400x600?text=Error"; }}
                  />
                  {book.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-md">
                        {book.discount}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="col-span-1 md:col-span-7 lg:col-span-8">
                <h1 className="text-3xl lg:text-4xl font-extrabold mb-3 text-dark leading-tight">{book.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star size={18} className="fill-[#FF974A] text-[#FF974A]" />
                    <span className="font-bold text-lg text-dark">{book.rating ? Number(book.rating).toFixed(1) : "0.0"}</span>
                  </div>
                  <span className="text-gray border-l border-gray-200 pl-4">
                    <span className="font-bold text-dark">{reviews.length}</span> Reviews
                  </span>
                  <div className="text-xs text-primary font-bold uppercase bg-primary/10 px-2 py-1 rounded-md">{book.category}</div>
                </div>

                <p className="text-gray leading-relaxed mb-8 text-[15px] line-clamp-4">{book.description}</p>

                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xl uppercase">
                      {book.author ? book.author.charAt(0) : "A"}
                  </div>
                  <div>
                    <div className="font-bold text-lg text-dark">{book.author}</div>
                    <div className="text-sm text-gray">Author</div>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-8">
                    <span className="text-4xl font-extrabold text-primary">
                        {formatCurrency(book.price - (book.price * (book.discount/100)))}
                    </span>
                    {book.discount > 0 && (
                        <span className="text-xl text-gray-400 line-through">
                            {formatCurrency(book.price)}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 w-full items-center">
                  <div className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-primary"><Minus size={18}/></button>
                    <span className="w-8 text-center font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="hover:text-primary"><Plus size={18}/></button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white py-3.5 rounded-xl font-bold text-lg hover:bg-opacity-90 shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} /> Beli Sekarang
                  </button>
                  
                  <button 
                    onClick={() => addToWishlist(book)}
                    className={`w-14 h-14 border border-gray-200 rounded-xl flex items-center justify-center transition-colors ${isInWishlist(book.id) ? 'bg-red-50 text-red-500 border-red-200' : 'hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Heart size={24} className={isInWishlist(book.id) ? "fill-red-500" : ""} />
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100 mb-12">
               <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto">
                <button onClick={() => setActiveTab("details")} className={`pb-4 text-lg font-bold transition-all whitespace-nowrap ${activeTab === "details" ? "text-primary border-b-[3px] border-primary" : "text-gray"}`}>Product Details</button>
                <button onClick={() => setActiveTab("reviews")} className={`pb-4 text-lg font-bold transition-all whitespace-nowrap ${activeTab === "reviews" ? "text-primary border-b-[3px] border-primary" : "text-gray"}`}>
                    Customer Reviews <span className="text-sm bg-gray-100 px-2 py-0.5 rounded-full ml-2 text-dark">{reviews.length}</span>
                </button>
               </div>
               
               {activeTab === "details" && (
                 <div className="space-y-6 animate-fade-in text-gray-600 leading-relaxed">
                    <p>{book.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div><span className="font-bold text-dark block mb-1">Kategori:</span> {book.category}</div>
                        <div><span className="font-bold text-dark block mb-1">Stok:</span> {book.stock > 0 ? "Tersedia" : "Habis"}</div>
                    </div>
                 </div>
               )}

               {/* TAB REVIEWS (DATABASE) */}
               {activeTab === "reviews" && (
                 <div className="animate-fade-in">
                    {/* Form Review */}
                    <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                        <h3 className="font-bold text-dark mb-4">Tulis Ulasan Anda</h3>
                        {!user ? (
                            <div className="text-sm text-gray">
                                Silakan <Link to="/login" className="text-primary font-bold underline">Login</Link> untuk menulis ulasan.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitReview}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm font-bold text-gray">Rating:</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button type="button" key={star} onClick={() => setReviewForm({...reviewForm, rating: star})}>
                                                <Star size={24} className={star <= reviewForm.rating ? "fill-[#FF974A] text-[#FF974A]" : "text-gray-300"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea 
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-primary mb-4 bg-white" 
                                    rows="3"
                                    placeholder="Ceritakan pengalaman Anda membaca buku ini..."
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                                    required
                                ></textarea>
                                <button type="submit" disabled={submittingReview} className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-opacity-90">
                                    {submittingReview ? "Mengirim..." : "Kirim Ulasan"}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? reviews.map((rev) => (
                            <div key={rev.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User size={20} className="text-gray-500" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-dark text-sm">{rev.user_name}</div>
                                            <div className="flex gap-0.5">{renderStars(rev.rating)}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray text-sm leading-relaxed pl-[52px]">{rev.comment}</p>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-400">Belum ada ulasan.</div>
                        )}
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Sidebar Related Books (Kanan) */}
          <aside className="col-span-1 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-dark mb-6">Related Books</h3>
              <div className="space-y-5">
                {relatedBooks.map((relBook) => (
                  <Link to={`/book/${relBook.id}`} key={relBook.id} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all group">
                     <div className="w-20 aspect-[2/3] bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                            src={relBook.image || "https://placehold.co/400x600?text=No+Img"} 
                            className="w-full h-full object-cover" 
                            alt={relBook.title}
                            onError={(e) => { e.target.src = "https://placehold.co/400x600?text=No+Img"; }}
                        />
                     </div>
                     <div className="flex-1 py-1 min-w-0">
                        <h4 className="font-bold text-[15px] mb-1 line-clamp-2 text-dark group-hover:text-primary transition">{relBook.title}</h4>
                        <div className="font-bold text-primary">{formatCurrency(relBook.price)}</div>
                     </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;