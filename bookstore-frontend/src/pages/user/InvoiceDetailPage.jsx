import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { Printer, ArrowLeft, Download, CheckCircle, MapPin } from "lucide-react";

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil detail order + items dari backend
    fetch(`http://localhost:3001/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat Invoice...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Invoice tidak ditemukan.</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-10 print:bg-white print:py-0 font-sans">
      
      {/* Header Navigasi (Disembunyikan saat Print) */}
      <div className="container mx-auto max-w-3xl px-6 mb-6 flex justify-between items-center print:hidden">
        <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-dark font-bold">
          <ArrowLeft size={20} /> Kembali
        </Link>
        <button 
            onClick={handlePrint}
            className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-opacity-90 shadow-lg"
        >
            <Printer size={18}/> Cetak Invoice
        </button>
      </div>

      {/* Kertas Invoice */}
      <div className="container mx-auto max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-xl print:shadow-none print:p-0">
        
        {/* Kop Surat */}
        <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-primary mb-2">BookStore</h1>
                <p className="text-gray-500 text-sm">Jl. Margonda Raya No. 100<br/>Depok, Jawa Barat 16424</p>
            </div>
            <div className="text-right">
                <h2 className="text-xl font-bold text-dark mb-1">INVOICE</h2>
                <p className="text-sm text-gray-500 font-mono mb-1">#{order.id}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                    order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered'
                    ? "bg-green-100 text-green-700 border-green-200" 
                    : "bg-orange-100 text-orange-700 border-orange-200"
                }`}>
                    {order.status === 'paid' ? <CheckCircle size={12}/> : null} {order.status}
                </div>
            </div>
        </div>

        {/* Info Pelanggan & Tanggal */}
        <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Ditagihkan Kepada</h3>
                <p className="font-bold text-dark text-lg">{order.user_name || "Pelanggan"}</p>
                <p className="text-gray-500 text-sm">{order.email}</p>
                <p className="text-gray-500 text-sm mt-2 flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0"/> 
                    Jl. Akses UI No. 99, Kelapa Dua<br/>(Alamat dari Checkout)
                </p>
            </div>
            <div className="text-right">
                <div className="mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Tanggal Pesanan</h3>
                    <p className="font-bold text-dark">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </p>
                </div>
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Metode Pembayaran</h3>
                    <p className="font-bold text-dark uppercase">{order.payment_method || "QRIS"}</p>
                </div>
            </div>
        </div>

        {/* Tabel Barang */}
        <div className="mb-10">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Deskripsi Item</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-center">Qty</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Harga Satuan</th>
                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {order.items && order.items.map((item, index) => (
                        <tr key={index}>
                            <td className="py-4 px-4">
                                <p className="font-bold text-dark text-sm">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.author}</p>
                            </td>
                            <td className="py-4 px-4 text-center text-sm font-medium">{item.quantity}</td>
                            <td className="py-4 px-4 text-right text-sm text-gray-600">{formatCurrency(item.price)}</td>
                            <td className="py-4 px-4 text-right text-sm font-bold text-dark">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Total Harga */}
        <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end gap-12 text-right">
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-sm text-gray-500">Pajak (PPN 11%)</p>
                    <p className="text-sm text-gray-500">Biaya Pengiriman</p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-800">{formatCurrency(order.total_amount * 0.9)}</p> {/* Estimasi */}
                    <p className="text-sm font-bold text-gray-800">{formatCurrency(order.total_amount * 0.1)}</p>
                    <p className="text-sm font-bold text-gray-800">Rp 0 (Promo)</p>
                </div>
            </div>
            <div className="flex justify-end gap-12 text-right mt-6 pt-6 border-t border-gray-100">
                <p className="text-xl font-bold text-dark">Total Tagihan</p>
                <p className="text-2xl font-extrabold text-primary">{formatCurrency(order.total_amount)}</p>
            </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center pt-8 border-t border-gray-100">
            <p className="font-bold text-dark mb-1">Terima Kasih Telah Berbelanja!</p>
            <p className="text-xs text-gray-500">Harap simpan bukti pembayaran ini sebagai garansi pembelian.</p>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetailPage;