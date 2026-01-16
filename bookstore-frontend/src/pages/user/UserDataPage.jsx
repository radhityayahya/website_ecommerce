import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Lock,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Truck,
  Wallet,
  FileText,
  LogOut, // Pastikan LogOut diimport
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

const UserDataPage = () => {
  const { logout } = useAuth(); // Ambil fungsi logout
  const [activeTab, setActiveTab] = useState("overview");
  const toast = useToast();
  
  const [userData, setUserData] = useState({
    username: "johndoe123",
    name: "John Doe",
    email: "john@example.com",
    phone: "081234567890",
    dob: "1995-08-17",
    bio: "Book lover & avid reader",
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "Home",
      name: "John Doe",
      phone: "081234567890",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      street: "Jl. Jendral Sudirman No. 1",
      detail: "Apartment 4B",
      isPrimary: true,
    },
    {
      id: 2,
      label: "Office",
      name: "John Doe",
      phone: "081234567890",
      province: "Jawa Barat",
      city: "Bandung",
      street: "Jl. Asia Afrika No. 10",
      detail: "Floor 5",
      isPrimary: false,
    },
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  
  const [newAddress, setNewAddress] = useState({
    label: "",
    name: "",
    phone: "",
    province: "",
    city: "",
    street: "",
    detail: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const orders = [
    {
      id: "ORD17001",
      date: "12 Jan 2026",
      status: "Delivered",
      paymentStatus: "Paid",
      total: 156000,
      items: [
        { title: "Laskar Pelangi", qty: 1, price: 85000 },
        { title: "Bumi Manusia", qty: 1, price: 71000 },
      ],
    },
    {
      id: "ORD17684",
      date: "14 Jan 2026",
      status: "Waiting for Payment",
      paymentStatus: "Unpaid",
      total: 120000,
      items: [{ title: "Filosofi Teras", qty: 1, price: 120000 }],
    },
    {
      id: "ORD16988",
      date: "10 Dec 2025",
      status: "Processing",
      paymentStatus: "Paid",
      total: 85000,
      items: [{ title: "Atomic Habits", qty: 1, price: 85000 }],
    },
    {
      id: "ORD16800",
      date: "05 Nov 2025",
      status: "Cancelled",
      paymentStatus: "Unpaid",
      total: 250000,
      items: [{ title: "Clean Code", qty: 1, price: 250000 }],
    },
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success("Profil berhasil diperbarui!");
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }
    toast.success("Password berhasil diubah!");
    setPasswordForm({ current: "", new: "", confirm: "" });
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const addressEntry = {
      id: Date.now(),
      ...newAddress,
      isPrimary: addresses.length === 0,
    };
    setAddresses([...addresses, addressEntry]);
    setShowAddressForm(false);
    setNewAddress({ label: "", name: "", phone: "", province: "", city: "", street: "", detail: "" });
  };

  const handleDeleteAddress = (id) => {
    setDeleteModal({ isOpen: true, id });
  };

  const traverseDeleteAddress = () => {
    setAddresses(addresses.filter((a) => a.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: null });
    toast.success("Alamat berhasil dihapus");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Waiting for Payment":
        return "bg-orange-100 text-orange-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusIcon = (status) => {
    if (status === "Paid") return <CheckCircle size={14} className="text-green-500" />;
    if (status === "Unpaid") return <Clock size={14} className="text-yellow-500" />;
    return <XCircle size={14} className="text-red-500" />;
  };

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={traverseDeleteAddress}
        title="Hapus Alamat"
        message="Apakah Anda yakin ingin menghapus alamat ini?"
        confirmText="Hapus"
        cancelText="Batal"
      />
      <div className="container mx-auto max-w-[1200px] px-6 py-8">
        <h1 className="text-3xl font-extrabold text-dark mb-8">Akun Saya</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 text-center border-b border-gray-100">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden relative group cursor-pointer">
                  <img
                    src="https://i.pravatar.cc/150?img=12"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-dark">{userData.name}</h3>
                <p className="text-sm text-gray">{userData.email}</p>
              </div>
              
              <nav className="p-2 space-y-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "overview"
                      ? "bg-primary text-white font-bold"
                      : "text-gray hover:bg-gray-50"
                  }`}>
                  <User size={18} /> Ringkasan Akun
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-primary text-white font-bold"
                      : "text-gray hover:bg-gray-50"
                  }`}>
                  <User size={18} /> Profil Saya
                </button>
                <button
                  onClick={() => setActiveTab("address")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "address"
                      ? "bg-primary text-white font-bold"
                      : "text-gray hover:bg-gray-50"
                  }`}>
                  <MapPin size={18} /> Alamat Pengiriman
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "orders"
                      ? "bg-primary text-white font-bold"
                      : "text-gray hover:bg-gray-50"
                  }`}>
                  <Package size={18} /> Riwayat Pesanan
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "security"
                      ? "bg-primary text-white font-bold"
                      : "text-gray hover:bg-gray-50"
                  }`}>
                  <Lock size={18} /> Keamanan & Password
                </button>
                <Link
                  to="/wishlist"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray hover:bg-gray-50 transition-colors">
                  <Heart size={18} /> Wishlist
                </Link>

                {/* --- TOMBOL LOGOUT DITAMBAHKAN DI SINI --- */}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-colors font-medium border-t border-gray-50 mt-2">
                  <LogOut size={18} /> Keluar Akun
                </button>
                {/* ----------------------------------------- */}

              </nav>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-9">
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-dark">Status Pesanan</h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                      Lihat Semua <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        {orders.length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {orders.length}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">Semua</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition">
                      <div className="relative">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Wallet size={24} />
                        </div>
                        {orders.filter((o) => ["Unpaid", "Waiting for Payment"].includes(o.status))
                          .length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {
                              orders.filter((o) => ["Unpaid", "Waiting for Payment"].includes(o.status))
                                .length
                            }
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">Belum Bayar</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition">
                      <div className="relative">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package size={24} />
                        </div>
                        {orders.filter((o) => o.status === "Processing").length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {orders.filter((o) => o.status === "Processing").length}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">Di Proses</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition">
                      <div className="relative">
                        <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Truck size={24} />
                        </div>
                        {orders.filter((o) => o.status === "Shipped").length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {orders.filter((o) => o.status === "Shipped").length}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">Dikirim</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="flex flex-col items-center gap-2 group p-2 rounded-xl hover:bg-gray-50 transition">
                      <div className="relative">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CheckCircle size={24} />
                        </div>
                        {orders.filter((o) => o.status === "Delivered").length > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {orders.filter((o) => o.status === "Delivered").length}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">Selesai</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-dark flex items-center gap-2">
                      Aktivitas Terakhir
                    </h3>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                      Lihat Semua <ChevronRight size={16} />
                    </button>
                  </div>
                  {orders.length > 0 ? (
                    <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray mb-1">Order ID: {orders[0].id}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusColor(
                                orders[0].status
                              )}`}>
                              {orders[0].status}
                            </span>
                            <span className="text-xs text-gray font-medium">{orders[0].date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">
                            {formatCurrency(orders[0].total)}
                          </p>
                          <span className="text-[10px] text-gray">{orders[0].items.length} Barang</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                          {orders[0].items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden"
                              title={item.title}>
                            </div>
                          ))}
                          {orders[0].items.length > 3 && (
                            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray">
                              +{orders[0].items.length - 3}
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/order/${orders[0].id}`}
                          className="ml-auto bg-gray-50 text-dark border border-gray-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition">
                          Detail Pesanan
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray">Belum ada aktivitas pesanan.</div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("address")}
                    className="bg-white p-4 rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition text-left flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark group-hover:text-primary transition-colors">
                        Alamat Pengiriman
                      </h4>
                      <p className="text-xs text-gray">Kelola alamat rumah & kantor</p>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className="bg-white p-4 rounded-xl border border-gray-100 hover:border-primary/50 hover:shadow-md transition text-left flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark group-hover:text-primary transition-colors">
                        Keamanan Akun
                      </h4>
                      <p className="text-xs text-gray">Ubah password & keamanan</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Edit Profil</h2>
                <form onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray mb-2">Username</label>
                      <input
                        type="text"
                        value={userData.username}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray mb-2">Email</label>
                      <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray mb-2">No. Telepon</label>
                      <input
                        type="tel"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray mb-2">
                        Tanggal Lahir (TTL)
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray"
                          size={18}
                        />
                        <input
                          type="date"
                          value={userData.dob}
                          onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold text-gray mb-2">Bio Singkat</label>
                    <textarea
                      rows="4"
                      value={userData.bio}
                      onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary"></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-primary/20">
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === "address" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold">Daftar Alamat</h2>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-opacity-90 transition">
                    <Plus size={16} /> Tambah Alamat
                  </button>
                </div>
                {showAddressForm && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-slide-in-down">
                    <h3 className="font-bold text-lg mb-6">Tambah Alamat Baru</h3>
                    <form onSubmit={handleAddAddress}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                          placeholder="Label Alamat (Rumah, Kantor, dll)"
                          className="input-field"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          required
                        />
                        <input
                          placeholder="Nama Penerima"
                          className="input-field"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          required
                        />
                        <input
                          placeholder="No. Telepon"
                          className="input-field"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          required
                        />
                        <input
                          placeholder="Provinsi"
                          className="input-field"
                          value={newAddress.province}
                          onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                          required
                        />
                        <input
                          placeholder="Kota/Kabupaten"
                          className="input-field"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          required
                        />
                        <input
                          placeholder="Nama Jalan & Nomor"
                          className="input-field"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Detail Alamat (Patokan, Lantai, dll)"
                        className="input-field mb-6 h-24 pt-3"
                        value={newAddress.detail}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, detail: e.target.value })
                        }></textarea>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 py-2 border border-gray-200 rounded-xl font-bold text-gray hover:bg-gray-50">
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90">
                          Simpan Alamat
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white p-6 rounded-2xl border ${
                        addr.isPrimary ? "border-primary ring-1 ring-primary" : "border-gray-100"
                      } hover:shadow-md transition relative group`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-dark flex items-center gap-2">
                            {addr.label}
                            {addr.isPrimary && (
                              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Utama
                              </span>
                            )}
                          </h4>
                          <p className="font-bold text-sm text-gray-700 mt-1">{addr.name}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-gray-100 rounded-lg text-gray hover:text-primary">
                            <Edit2 size={14} />
                          </button>
                          {!addr.isPrimary && (
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-2 bg-red-50 rounded-lg text-red-500 hover:bg-red-100">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray mb-1">{addr.phone}</p>
                      <p className="text-sm text-gray mb-1 leading-relaxed">
                        {addr.street}, {addr.detail}
                        <br />
                        {addr.city}, {addr.province}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in max-w-2xl">
                <h2 className="text-xl font-bold mb-6">Ubah Password</h2>
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray mb-2">Password Saat Ini</label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray mb-2">Password Baru</label>
                    <input
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="pt-4">
                    <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition">
                      Ubah Password
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Riwayat Pesanan</h2>
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all group">
                      <div className="flex flex-wrap justify-between items-start mb-6 pb-6 border-b border-gray-50">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-dark text-lg">{order.id}</span>
                            <span className="text-xs text-gray">{order.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                order.status
                              )}`}>
                              {order.status}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 flex items-center gap-1">
                              {getPaymentStatusIcon(order.paymentStatus)} {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {order.status === "Waiting for Payment" && (
                            <Link
                              to={`/payment/qris/${order.id}`}
                              className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-opacity-90 transition shadow-md shadow-primary/20">
                              Bayar Sekarang
                            </Link>
                          )}
                          {order.status === "Waiting for Payment" ? (
                            <Link
                              to={`/payment/qris/${order.id}`}
                              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:underline">
                              Lihat Detail <ChevronRight size={16} />
                            </Link>
                          ) : (
                            <Link
                              to={`/order/${order.id}`}
                              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:underline">
                              Lihat Detail <ChevronRight size={16} />
                            </Link>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              <span className="font-bold text-dark">{item.qty}x</span> {item.title}
                            </span>
                            <span className="font-medium">{formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray">Total Pesanan</span>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .input-field {
            width: 100%;
            padding: 12px 16px;
            background-color: #F8F9FA;
            border: 1px solid #E5E7EB;
            border-radius: 0.75rem;
            outline: none;
            transition: all 0.2s;
        }
        .input-field:focus {
            border-color: #FF754C;
            background-color: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
export default UserDataPage;