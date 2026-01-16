import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const toast = useToast();
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  const addToWishlist = (book) => {
    if (!wishlist.find((item) => item.id === book.id)) {
      setWishlist([...wishlist, book]);
      toast.success("Berhasil ditambahkan ke Wishlist! ❤️");
    }
  };
  const removeFromWishlist = (bookId) => {
    setWishlist(wishlist.filter((item) => item.id !== bookId));
    toast.info("Dihapus dari Wishlist");
  };
  const toggleWishlist = (book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };
  const isInWishlist = (bookId) => {
    return wishlist.some((item) => item.id === bookId);
  };
  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};