import { useWishlist } from "../../context/WishlistContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { formatCurrency } from "../../services/dataService";
import { useCart } from "../../context/CartContext";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFCFD] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-dark mb-2">Wishlist Kosong</h2>
        <p className="text-gray mb-8">Simpan buku favoritmu di sini agar tidak lupa!</p>
        <Link to="/bookstore" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
          Cari Buku
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFCFD] min-h-screen py-10 font-sans">
      <div className="container mx-auto max-w-5xl px-6">
        <h1 className="text-3xl font-bold text-dark mb-8 flex items-center gap-3">
            <Heart className="fill-red-500 text-red-500" /> Wishlist Saya
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((book) => (
            <div key={book.id} className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group relative">
              
              <button 
                onClick={() => removeFromWishlist(book.id)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray hover:text-red-500 hover:bg-red-50 transition z-10"
                title="Hapus"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex gap-4">
                <div className="w-24 h-32 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                   <img 
                    src={book.image || "https://placehold.co/400x600?text=No+Img"} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                   />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <div className="text-xs font-bold text-primary uppercase mb-1">{book.category}</div>
                        <Link to={`/book/${book.id}`}>
                            <h3 className="font-bold text-dark line-clamp-2 hover:text-primary transition-colors mb-1">
                                {book.title}
                            </h3>
                        </Link>
                        <p className="text-xs text-gray">{book.author}</p>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-dark mb-3">{formatCurrency(book.price)}</div>
                        <button 
                            onClick={() => addToCart({...book, quantity: 1})}
                            className="w-full py-2 bg-gray-50 text-dark font-bold text-sm rounded-lg hover:bg-primary hover:text-white transition flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={16} /> Add to Cart
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;