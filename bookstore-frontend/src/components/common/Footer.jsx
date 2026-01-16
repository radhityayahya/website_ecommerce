import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto max-w-[1600px] px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Nalar" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-gray-500 leading-relaxed">
              Temukan ribuan buku inspiratif untuk menemani perjalanan intelektual Anda. Baca,
              berkembang, dan jadilah versi terbaik dari diri Anda.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-dark text-lg mb-6">Jelajahi</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/bookstore" className="text-gray-500 hover:text-primary transition-colors">
                  Semua Buku
                </Link>
              </li>
              <li>
                <Link
                  to="/bookstore?category=fiction"
                  className="text-gray-500 hover:text-primary transition-colors">
                  Fiksi
                </Link>
              </li>
              <li>
                <Link
                  to="/bookstore?category=education"
                  className="text-gray-500 hover:text-primary transition-colors">
                  Edukasi
                </Link>
              </li>
              <li>
                <Link
                  to="/bookstore?category=business"
                  className="text-gray-500 hover:text-primary transition-colors">
                  Bisnis & Ekonomi
                </Link>
              </li>
              <li>
                <Link
                  to="/bookstore?category=self-improvement"
                  className="text-gray-500 hover:text-primary transition-colors">
                  Pengembangan Diri
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-dark text-lg mb-6">Bantuan</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-primary transition-colors">
                  Akun Saya
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-500 hover:text-primary transition-colors">
                  Riwayat Pesanan
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-500 hover:text-primary transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-dark text-lg mb-6">Hubungi Kami</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                <span className="text-gray-500 leading-relaxed">
                  Jl. Jendral Sudirman No. 1, Jakarta Selatan, DKI Jakarta 12190
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-primary flex-shrink-0" size={20} />
                <span className="text-gray-500">support@nalarbookstore.com</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-primary flex-shrink-0" size={20} />
                <span className="text-gray-500">+62 812 3456 7890</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2026 Nalar Bookstore. All rights reserved.</p>
          <div className="flex gap-6">
            <div className="h-8 bg-gray-100 rounded px-2 flex items-center text-xs font-bold text-gray-500">
              VISA
            </div>
            <div className="h-8 bg-gray-100 rounded px-2 flex items-center text-xs font-bold text-gray-500">
              Mastercard
            </div>
            <div className="h-8 bg-gray-100 rounded px-2 flex items-center text-xs font-bold text-gray-500">
              BCA
            </div>
            <div className="h-8 bg-gray-100 rounded px-2 flex items-center text-xs font-bold text-gray-500">
              QRIS
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
