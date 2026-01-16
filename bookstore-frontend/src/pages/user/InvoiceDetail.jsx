import { useParams, Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { CheckCircle, Printer, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  // LOGIKA BARU: Fetch dari database, bukan localStorage
  useEffect(() => {
    fetch(`http://localhost:3001/api/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        // Transform data agar cocok dengan tampilan lama
        setInvoice({
            id: data.id,
            user: "Customer", // Karena backend belum kirim nama user, kita pakai placeholder
            date: data.created_at,
            items: data.items || [],
            total: data.total_amount
        });
      })
      .catch(err => console.error("Error loading invoice", err));
  }, [id]);

  if (!invoice) {
    return <div className="text-center py-12">Loading Invoice...</div>;
  }

  // --- TAMPILAN DI BAWAH INI TIDAK ADA YANG DIUBAH DARI FILE ASLI ---
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div className="mb-6">
        <Link to="/" className="flex items-center gap-2 text-muted hover:text-primary">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      <div className="card" style={{ padding: "3rem" }}>
        <div
          className="text-center mb-8 border-b pb-8"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
            style={{ backgroundColor: "#d1fae5", color: "#059669" }}>
            <CheckCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>
          <p className="text-muted">Thank you for your purchase!</p>
        </div>
        <div className="flex justify-between mb-8">
          <div>
            <p className="text-sm text-muted uppercase mb-1">Billed To</p>
            <p className="font-bold text-lg">{invoice.user}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted uppercase mb-1">Invoice Info</p>
            <p className="font-bold">#{invoice.id}</p>
            <p className="text-muted">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
        </div>
        <table className="w-full mb-8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <th className="text-left py-4">Item</th>
              <th className="text-center py-4">Qty</th>
              <th className="text-right py-4">Price</th>
              <th className="text-right py-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="py-4">
                  <span className="font-medium block">{item.title}</span>
                  <span className="text-sm text-muted">{item.brand || item.author}</span>
                </td>
                <td className="text-center py-4">{item.quantity}</td>
                <td className="text-right py-4">{formatCurrency(item.price)}</td>
                <td className="text-right py-4 font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span className="font-bold">{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between mb-4 pb-4 border-b">
              <span className="text-muted">Tax (0%)</span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
        <div className="text-center flex justify-center gap-4 hidden-print">
          <button onClick={() => window.print()} className="btn btn-outline flex items-center gap-2">
            <Printer size={18} /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
export default InvoiceDetail;