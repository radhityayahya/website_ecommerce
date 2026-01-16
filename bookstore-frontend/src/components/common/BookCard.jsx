import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { formatCurrency } from "../../services/dataService";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const toast = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Mencegah link diklik saat tekan tombol cart
    addToCart({ ...book, quantity: 1 });
    toast.success("Berhasil masuk keranjang!");
  };

  return (
    <Link 
      to={`/book/${book.id}`} 
      className="group bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Container Gambar */}
      <div className="relative aspect-[2/3] bg-gray-100 rounded-xl overflow-hidden mb-3">
        <img 
          src={book.image || "https://placehold.co/400x600?text=No+Cover"} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = "https://placehold.co/400x600?text=Error"; }}
        />
        
        {/* Badge Diskon (Jika ada) */}
        {book.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
            -{book.discount}%
          </div>
        )}

        {/* Tombol Cart Melayang */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white text-dark rounded-full flex items-center justify-center shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white z-10"
          title="Tambah ke Keranjang"
        >
          <ShoppingCart size={18} />
        </button>
      </div>

      {/* Info Buku */}
      <div className="flex flex-col flex-1">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">
          {book.category}
        </div>
        
        <h3 className="font-bold text-dark text-sm leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        
        <p className="text-xs text-gray-500 mb-3">{book.author}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            {book.discount > 0 && (
               <span className="text-[10px] text-gray-400 line-through block">
                 {formatCurrency(book.price)}
               </span>
            )}
            <span className="font-extrabold text-sm text-dark">
              {formatCurrency(book.price - (book.price * (book.discount/100)))}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400 bg-orange-50 px-1.5 py-0.5 rounded-md">
            <Star size={10} className="fill-orange-400" /> 
            {book.rating ? Number(book.rating).toFixed(1) : "0.0"}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;