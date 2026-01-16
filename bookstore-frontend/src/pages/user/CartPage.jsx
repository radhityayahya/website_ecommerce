import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { formatCurrency, books } from "../../services/dataService";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import BookCard from "../../components/common/BookCard";
const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedItems, setSelectedItems] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // "single" | "all"
    id: null,
    title: "",
    message: "",
  });
  const toggleSelection = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
  };
  const requestRemoveItem = (item) => {
    setConfirmModal({
      isOpen: true,
      type: "single",
      id: item.id,
      title: "Hapus Item?",
      message: `Apakah Anda yakin ingin menghapus "${item.title}" dari keranjang?`,
    });
  };
  const requestClearCart = () => {
    setConfirmModal({
      isOpen: true,
      type: "all",
      id: null,
      title: "Hapus Semua Item?",
      message:
        "Apakah Anda yakin ingin menghapus semua item dari keranjang Anda? Tindakan ini tidak dapat dibatalkan.",
    });
  };
  const handleConfirmAction = () => {
    if (confirmModal.type === "single") {
      removeFromCart(confirmModal.id);
      if (selectedItems.includes(confirmModal.id)) {
        setSelectedItems((prev) => prev.filter((id) => id !== confirmModal.id));
      }
    } else if (confirmModal.type === "all") {
      clearCart();
      setSelectedItems([]);
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };
  const selectedCartItems = cart.filter((item) => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.11; // 11% tax
  const shipping = selectedCartItems.length > 0 ? 15000 : 0;
  const total = subtotal + tax + shipping;
  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      if (selectedCartItems.length === 0) {
        toast.warning("Pilih minimal satu barang untuk di-checkout!");
        return;
      }
      return;
    }
    navigate("/checkout", { state: { items: selectedCartItems } });
  };
  if (cart.length === 0) {
    return (
      <div className="bg-[#FCFCFD] min-h-screen">
        <div className="container mx-auto max-w-[1200px] px-6 py-16">
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={64} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Keranjang Belanja Kosong</h2>
            <p className="text-gray mb-8">Belum ada produk yang ditambahkan ke keranjang</p>
            <Link
              to="/bookstore"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-opacity-90 transition">
              Mulai Belanja <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#FCFCFD] min-h-screen">
      <div className="container mx-auto max-w-[1400px] px-6 py-8">
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={handleConfirmAction}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText="Hapus"
          cancelText="Batal"
        />
        <div className="text-sm text-gray mb-8">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          /<span className="text-dark font-medium"> Keranjang Belanja</span>
        </div>
        <h1 className="text-4xl font-bold mb-8">Keranjang Belanja</h1>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cart.length && cart.length > 0}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <h2 className="text-xl font-bold">Pilih Semua ({cart.length})</h2>
                </div>
                <button
                  onClick={requestClearCart}
                  className="text-red-500 hover:text-red-600 text-sm font-medium">
                  Hapus Semua
                </button>
              </div>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className={`flex gap-4 p-4 rounded-xl transition border ${
                      selectedItems.includes(item.id)
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:bg-gray-50"
                    }`}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelection(item.id)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="w-24 h-32 bg-[#C4C4C4] rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-gray mb-2">{item.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-[#F1F0FF] text-primary px-2 py-1 rounded font-medium">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <div className="text-2xl font-bold text-primary mb-1">
                          {formatCurrency(item.price)}
                        </div>
                        {item.originalPrice && (
                          <div className="text-sm text-gray line-through">
                            {formatCurrency(item.originalPrice)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200">
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-200">
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => requestRemoveItem(item)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-red-50 text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray">Subtotal ({selectedCartItems.length} item)</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray">Pajak (11%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray">Biaya Pengiriman</span>
                  <span className="font-medium">{formatCurrency(shipping)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold text-primary">{formatCurrency(total)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={selectedCartItems.length === 0}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                Lanjut ke Checkout <ArrowRight size={20} />
              </button>
              <Link
                to="/bookstore"
                className="block text-center text-primary font-medium text-sm mt-4 hover:underline">
                Lanjut Belanja
              </Link>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-bold mb-3 text-sm">Metode Pembayaran</h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-2 bg-gray-50 rounded text-xs font-medium">QRIS</div>
                  <div className="px-3 py-2 bg-gray-50 rounded text-xs font-medium">Credit Card</div>
                  <div className="px-3 py-2 bg-gray-50 rounded text-xs font-medium">Bank Transfer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20 border-t border-gray-100 pt-12">
          <h2 className="text-2xl font-bold mb-8">Mungkin Anda Suka</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;