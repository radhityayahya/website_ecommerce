import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package, Home } from "lucide-react";

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-[#FCFCFD] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={48} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-dark mb-2">Terima Kasih!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
            Pembayaran Anda berhasil diverifikasi. Pesanan <span className="font-mono font-bold text-dark">#{orderId}</span> sedang kami siapkan untuk dikirim.
        </p>

        <div className="space-y-3">
            <Link to="/profile" className="block w-full bg-white border border-gray-200 text-dark py-3.5 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <Package size={20}/> Cek Status Pesanan
            </Link>
            <Link to="/" className="block w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                <Home size={20}/> Kembali ke Beranda
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;