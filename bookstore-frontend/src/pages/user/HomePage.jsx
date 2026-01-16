import { Link } from "react-router-dom";
import { books, formatCurrency, testimonials } from "../../services/dataService";
import { useCart } from "../../context/CartContext";
import {
  ArrowRight,
  ShoppingCart,
  Zap,
  ShieldCheck,
  ThumbsUp,
  Star,
  ChevronLeft,
  ChevronRight,
  Heart,
  Menu,
} from "lucide-react";
import BookCard from "../../components/common/BookCard";
const HomePage = () => {
  const { addToCart } = useCart();
  const bestSeller = books.find((b) => b.title === "Laskar Pelangi");
  const specialOffers = books.slice(0, 12);
  const flashSaleBooks = books.slice(4, 9);
  const booksOnSale = [...books, ...books, ...books];
  const featuredBooks = books.slice(0, 6);
  const handleAddToCart = (e, book) => {
    e.preventDefault(); // Prevent link navigation if inside a Link
    addToCart({ ...book, quantity: 1 });
  };
  return (
    <div className="bg-[#FCFCFD] font-sans overflow-x-hidden">
      <div className="container mx-auto max-w-[1600px] px-4 md:px-6">
        <section className="relative bg-[#F2F1FF] rounded-[32px] pt-12 pb-12 px-6 md:px-12 overflow-hidden mt-6 md:mt-8 mb-12 hover:shadow-lg transition-shadow duration-500">
          <div className="absolute right-0 top-0 w-full md:w-[45%] h-full bg-[#FF974A] rounded-l-none md:rounded-l-full transform translate-x-0 md:translate-x-1/3 transition-transform duration-1000 ease-out hover:translate-x-0 md:hover:translate-x-1/4 opacity-10 md:opacity-100"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="col-span-1 lg:col-span-7 animate-fade-in-up text-center lg:text-left">
              <div className="inline-block px-4 py-1.5 bg-white rounded-full text-primary font-bold text-[10px] md:text-[11px] tracking-[0.1em] uppercase mb-6 shadow-sm">
                Back to School
              </div>
              <h1 className="text-[42px] md:text-[56px] font-extrabold text-[#11142D] leading-[1.1] mb-4 tracking-tight">
                Special 50% Off
              </h1>
              <p className="text-lg md:text-xl font-medium text-[#11142D] mb-6">
                for our student community
              </p>
              <p className="text-sm md:text-[15px] text-gray leading-relaxed max-w-md mb-8 mx-auto lg:mx-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
                <Link
                  to="/bookstore"
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-opacity-90 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2">
                  Dapatkan Penawaran <ArrowRight size={18} />
                </Link>
                <Link
                  to="/bookstore"
                  className="bg-white text-dark px-8 py-4 rounded-xl font-bold text-[15px] hover:bg-gray-50 transition-all hover:scale-105 hover:shadow-md border border-gray-100 text-center">
                  Promo Lainnya
                </Link>
              </div>
              <div className="flex gap-2.5 justify-center lg:justify-start">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
                <div className="w-8 h-2.5 rounded-full bg-primary/30"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
              </div>
            </div>
            <div className="col-span-1 lg:col-span-5 relative flex justify-center lg:justify-end pr-0 lg:pr-8 mt-4 lg:mt-0">
              <div className="relative bg-[#969696]/90 backdrop-blur-sm rounded-[28px] p-6 w-[280px] text-white text-center shadow-2xl transform transition-transform hover:-translate-y-2 hover:rotate-1 duration-500">
                <h3 className="text-2xl font-bold mb-0.5">Best Seller</h3>
                <p className="text-[11px] opacity-70 mb-5">Berdasarkan Penjualan Minggu ini</p>
                <div className="bg-gray-300 rounded-2xl w-full h-[280px] mb-5 mx-auto border-[3px] border-white/20 shadow-inner overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 opacity-80"></div>
                </div>
                <h4 className="text-lg font-bold mb-1 truncate px-2">
                  {bestSeller?.title || "Laskar Pelangi"}
                </h4>
                <div className="text-[10px] uppercase tracking-wider opacity-60 mb-5 truncate px-2">
                  {bestSeller?.tags?.join(" • ") || "Novel, Inspiratif"}
                </div>
                <div className="bg-white text-dark rounded-xl py-2.5 px-5 inline-flex items-center gap-3 font-bold shadow-lg text-sm group cursor-pointer hover:bg-gray-50 transition">
                  <span className="text-gray line-through text-xs">
                    {formatCurrency(bestSeller?.originalPrice || 125000)}
                  </span>
                  <span className="text-lg text-primary">
                    {formatCurrency(bestSeller?.price || 89000)}
                  </span>
                </div>
                <button className="absolute top-1/2 -left-3 md:-left-5 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 backdrop-blur-md -translate-y-1/2 transition-all hover:scale-110 shadow-lg border border-white/20">
                  <ChevronLeft size={22} />
                </button>
                <button className="absolute top-1/2 -right-3 md:-right-5 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 backdrop-blur-md -translate-y-1/2 transition-all hover:scale-110 shadow-lg border border-white/20">
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          </div>
          <div className="hidden md:block absolute bottom-0 left-[30%] w-56 h-28 bg-[#D8D6FF] rounded-t-full opacity-50 blur-3xl"></div>
          <div className="hidden md:grid absolute left-16 top-16 grid-cols-3 gap-1.5 opacity-40">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}></div>
            ))}
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {[
            {
              icon: Zap,
              color: "text-purple-600",
              bg: "bg-purple-50",
              title: "Pengiriman Cepat",
              desc: "Pengiriman 24 jam ke seluruh kota besar",
            },
            {
              icon: ShieldCheck,
              color: "text-blue-600",
              bg: "bg-blue-50",
              title: "Pembayaran Aman",
              desc: "Transaksi terenkripsi dan terjamin aman",
            },
            {
              icon: ThumbsUp,
              color: "text-orange-500",
              bg: "bg-orange-50",
              title: "Kualitas Terbaik",
              desc: "Buku original langsung dari penerbit",
            },
            {
              icon: Star,
              color: "text-yellow-500",
              bg: "bg-yellow-50",
              title: "Garansi Pengembalian",
              desc: "30 hari garansi uang kembali",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex gap-4 items-start p-4 hover:bg-white hover:shadow-lg hover:rounded-2xl transition-all duration-300 group rounded-2xl">
              <div
                className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon size={26} className={`${f.color}`} />
              </div>
              <div>
                <h4 className="font-bold text-dark text-[16px] mb-2 leading-tight group-hover:text-primary transition-colors">
                  {f.title}
                </h4>
                <p className="text-[13px] text-gray leading-[1.6]">{f.desc}</p>
              </div>
            </div>
          ))}
        </section>
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {specialOffers.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
        <section className="mb-20 py-12 rounded-[40px] bg-gradient-to-b from-[#FFF5F5] to-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-red-100 blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-orange-100 blur-2xl"></div>
          </div>
          <div className="relative text-center mb-12 px-4">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-bounce">
              <Zap size={14} className="fill-current" /> Limited Time Only
            </div>
            <h2 className="text-3xl md:text-[42px] font-extrabold text-dark mb-4">Flash Sale</h2>
            <p className="text-gray text-[15px] mb-10 max-w-xl mx-auto">
              Kesempatan terakhir untuk mendapatkan buku-buku pilihan dengan harga super miring. Waktu
              terus berjalan!
            </p>
            <div className="flex justify-center gap-4 md:gap-8">
              {[
                { val: "02", label: "Day" },
                { val: "05", label: "Hours" },
                { val: "42", label: "Min" },
                { val: "19", label: "Sec" },
              ].map((t, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="text-3xl md:text-5xl font-black text-[#FF754C] mb-1 tabular-nums group-hover:scale-110 transition-transform">
                    {t.val}
                  </div>
                  <div className="text-[10px] md:text-[11px] text-gray font-bold uppercase tracking-[0.2em] opacity-60">
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
              {flashSaleBooks.map((book) => (
                <div key={book.id} className="text-center group relative">
                  <Link to={`/book/${book.id}`} className="block">
                    <div className="bg-white p-2 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 mb-4 transform group-hover:-translate-y-2">
                      <div className="bg-gray-200 rounded-xl aspect-[2/3] overflow-hidden relative">
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                          HOT
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-dark text-[14px] md:text-[15px] mb-1 truncate group-hover:text-primary transition-colors">
                      {book.title}
                    </h4>
                    <div className="text-[11px] text-gray uppercase mb-3 tracking-wide font-medium">
                      {book.category}
                    </div>
                    <div className="flex flex-col md:flex-row justify-center gap-1 md:gap-2 items-center md:items-baseline">
                      <span className="font-bold text-lg md:text-xl text-primary">
                        {formatCurrency(book.price)}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray line-through decoration-red-500/50">
                        {formatCurrency(book.originalPrice)}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {booksOnSale.map((book, index) => (
              <BookCard key={`${book.id}-${index}`} book={book} />
            ))}
          </div>
        </section>
        <section className="text-center mb-20">
          <h2 className="text-3xl md:text-[40px] font-bold mb-4">Our Happy Customers</h2>
          <p className="text-gray text-[16px] mb-12 max-w-2xl mx-auto px-4">
            Ribuan pembaca telah menemukan buku favorit mereka bersama kami. Apa kata mereka?
          </p>
          <div className="flex justify-center gap-0 mb-12 relative">
            <div className="absolute w-full h-[1px] bg-gray-100 top-1/2 -z-10"></div>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-full bg-gray-200 border-4 border-white shadow-md hover:scale-110 transition-transform cursor-pointer ${
                  i > 1 ? "-ml-4" : ""
                }`}></div>
            ))}
            <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs border-4 border-white shadow-xl -ml-4 z-10 cursor-pointer hover:bg-primary/90">
              21k+
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`p-8 rounded-[24px] text-left transition-all duration-500 cursor-default ${
                  i === 1
                    ? "bg-white shadow-2xl scale-100 md:scale-105 border-t-4 border-primary z-10"
                    : "bg-white/50 opacity-100 md:opacity-70 hover:opacity-100 hover:scale-100 hover:bg-white hover:shadow-lg"
                }`}>
                <div className="mb-6 text-primary">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                  </svg>
                </div>
                <p className="text-[15px] text-dark mb-6 leading-relaxed font-medium italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden ring-2 ring-gray-100">
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[15px] text-dark">{t.name}</div>
                    <div className="text-[12px] text-muted font-medium">{t.role}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s < t.rating
                              ? "fill-[#FF974A] text-[#FF974A]"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-gray font-bold">{t.rating}.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
export default HomePage;
