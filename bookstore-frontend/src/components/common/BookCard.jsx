import { Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useWishlist } from "../../context/WishlistContext";
const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent direct navigation if clicking button
    e.stopPropagation();
    addToCart({ ...book, quantity: 1 });
    toast.success(`${book.title} berhasil ditambahkan ke keranjang!`);
  };
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
  };
  const isLiked = isInWishlist(book.id);
  return (
    <div className="bg-white rounded-[20px] p-4 group border border-transparent hover:border-gray-50 flex flex-col h-full relative">
      <Link to={`/book/${book.id}`} className="block relative mb-4">
        <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 w-full h-full"></div>
          <div className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out bg-gray-200"></div>
          {book.discount && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg z-20">
              {book.discount}% OFF
            </div>
          )}
        </div>
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all z-30 translate-x-2 group-hover:translate-x-0 duration-300 ${
            isLiked
              ? "bg-red-50 text-red-500 opacity-100 scale-100"
              : "bg-white/90 backdrop-blur-sm text-gray opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 hover:scale-110"
          }`}>
          <Heart size={16} className={isLiked ? "fill-red-500" : ""} />
        </button>
      </Link>
      <div className="flex-1 flex flex-col">
        <Link to={`/book/${book.id}`}>
          <div className="mb-0.5">
            <h3 className="font-bold text-[15px] leading-tight truncate text-dark group-hover:text-primary transition-colors">
              {book.title}
            </h3>
          </div>
          <p className="text-[11px] text-gray uppercase tracking-wider font-bold mb-1 truncate">
            {book.author}
          </p>
          <div className="flex items-center gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`${
                  i < Math.floor(book.rating || 0)
                    ? "fill-[#FF974A] text-[#FF974A]"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
            <span className="text-xs font-medium text-dark ml-1">{book.rating || 4.5}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto mb-4">
            <span className="font-bold text-lg text-dark">{formatCurrency(book.price)}</span>
            {book.originalPrice && (
              <span className="text-xs text-gray line-through decoration-red-500/50">
                {formatCurrency(book.originalPrice)}
              </span>
            )}
          </div>
        </Link>
        <button
          onClick={handleAddToCart}
          className="w-full bg-white border border-gray-200 text-dark py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 group/btn mt-auto shadow-sm active:scale-95">
          <ShoppingCart size={16} className="text-gray group-hover/btn:text-white transition-colors" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
export default BookCard;