import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, ChevronDown, Menu, X, Bell } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import logo from "../../assets/logo.svg";
const Navbar = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  return (
    <nav className="bg-surface sticky top-0 z-50 shadow-sm border-b border-gray-100 font-sans">
      <div className="container mx-auto max-w-[1600px] px-4 md:px-6">
        <div className="flex justify-between items-center h-32">
          <Link to="/" className="flex items-center min-w-fit group z-50 relative">
            <img src={logo} alt="Nalar" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <div className="hidden lg:block flex-1 max-w-2xl px-8">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray group-hover:text-primary transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari lebih dari 30 juta buku..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base placeholder:text-gray-400 bg-gray-50/50 focus:bg-white"
              />
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-5 min-w-fit">
            <div className="relative group">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors outline-none">
                <Bell
                  size={24}
                  className={`transition-all ${
                    isNotificationOpen
                      ? "text-primary fill-primary/10"
                      : "text-gray group-hover:text-primary group-hover:scale-110"
                  }`}
                />
                <span className="absolute top-1.5 right-1.5 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white animate-pulse"></span>
              </button>
              {isNotificationOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-dark">Notifikasi</h3>
                    <span className="text-xs text-primary font-bold cursor-pointer hover:underline">
                      Tandai sudah dibaca
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {[
                      {
                        id: 1,
                        title: "Pesanan Berhasil",
                        desc: "Pembayaran untuk #ORD-2839 telah dikonfirmasi.",
                        time: "Baru saja",
                        read: false,
                        type: "order",
                      },
                      {
                        id: 2,
                        title: "Diskon Spesial 50%!",
                        desc: "Promo kilat untuk buku fiksi favoritmu. Serbu sekarang!",
                        time: "2 jam lalu",
                        read: false,
                        type: "promo",
                      },
                      {
                        id: 3,
                        title: "Paket Sedang Dikirim",
                        desc: "Kurir sedang menuju ke lokasi pengiriman.",
                        time: "1 hari lalu",
                        read: true,
                        type: "shipping",
                      },
                    ].map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${
                          !notif.read ? "bg-blue-50/30" : ""
                        }`}>
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            !notif.read ? "bg-primary" : "bg-transparent"
                          }`}></div>
                        <div>
                          <h4
                            className={`text-sm font-bold mb-0.5 ${
                              !notif.read ? "text-dark" : "text-gray-600"
                            }`}>
                            {notif.title}
                          </h4>
                          <p className="text-xs text-gray mb-2 leading-relaxed">{notif.desc}</p>
                          <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-50 bg-gray-50/50">
                    <button className="text-xs font-bold text-primary hover:underline">
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/wishlist"
              className="relative group p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <Heart
                size={24}
                className="text-gray group-hover:text-red-500 group-hover:scale-110 group-hover:fill-red-100 transition-all cursor-pointer"
              />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative group p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <ShoppingCart
                size={24}
                className="text-gray group-hover:text-primary group-hover:scale-110 transition-all cursor-pointer"
              />
              {cart?.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-md animate-pulse">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full cursor-pointer hover:ring-4 hover:ring-primary/30 transition-all shadow-md block"></Link>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-primary hover:text-white transition-all group">
              <span className="font-semibold text-sm">ID</span>
              <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
            </div>
          </div>
          <div className="flex lg:hidden items-center gap-3">
            <Link to="/user/cart" className="relative p-2">
              <ShoppingCart size={24} className="text-dark" />
              {cart?.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-dark hover:bg-gray-100 rounded-lg transition-colors z-50 relative">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        <div
          className={`
            lg:hidden fixed inset-0 bg-white z-40 pt-24 px-6 transition-all duration-300 ease-in-out transform
            ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}>
          <div className="mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" size={20} />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="space-y-6">
            <Link
              to="/wishlist"
              className="flex items-center gap-4 text-lg font-medium text-dark hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Heart size={20} />
              </div>
              Wishlist
              <span className="ml-auto bg-gray-100 text-xs py-1 px-2 rounded-full font-bold">0</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-4 text-lg font-medium text-dark hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-primary">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-purple-600 rounded-full"></div>
              </div>
              My Profile
            </Link>
            <div className="flex items-center gap-4 text-lg font-medium text-dark hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <span className="font-bold">ID</span>
              </div>
              Bahasa
            </div>
          </div>
          <div className="absolute bottom-10 left-6 right-6">
            <button className="w-full bg-gray-100 text-dark font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
