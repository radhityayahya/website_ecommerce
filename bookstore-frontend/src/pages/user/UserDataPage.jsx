import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Package,
  Heart,
  Lock,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Wallet,
  FileText,
  LogOut,
  Camera, // Tambah icon Camera
  Loader2 // Tambah icon Loader
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../services/dataService";
import { useToast } from "../../context/ToastContext";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { useAuth } from "../../context/AuthContext";

const UserDataPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const toast = useToast();
  
  // --- STATE DATA ---
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false); // State untuk loading upload
  
  const [userData, setUserData] = useState({
    username: user?.username || "",
    name: user?.name || "Pengguna",
    email: user?.email || "",
    phone: user?.phone || "-",
    image: user?.image || null, // Tambah field image
  });

  // --- FETCH DATA ---
  useEffect(() => {
    if (user) {
        // Ambil data user terbaru (termasuk foto profil jika ada update)
        fetch(`http://localhost:3001/api/users/${user.id}`) // Asumsi ada endpoint get detail user, atau pakai data login sementara
            .then(res => res.json())
            .then(u => {
                setUserData(prev => ({ 
                    ...prev, 
                    username: u.username || user.username, 
                    name: u.name || user.name, 
                    email: u.email || user.email,
                    image: u.image // Update image dari DB
                }));
            })
            .catch(err => console.log("Gagal ambil detail user, pakai data session"));

        // Fetch Orders
        fetch(`http://localhost:3001/api/orders/user/${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const mappedOrders = data.map(o => ({
                        id: `ORD-${o.id}`,
                        realId: o.id,
                        date: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                        status: o.status,
                        paymentStatus: ['paid', 'shipped', 'delivered'].includes(o.status) ? 'Paid' : 'Unpaid',
                        total: o.total_amount,
                        items: []
                    }));
                    setOrders(mappedOrders);
                }
            })
            .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  // --- HANDLE UPLOAD AVATAR ---
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
        toast.error("Mohon upload file gambar (JPG/PNG)");
        return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`http://localhost:3001/api/users/${user.id}/avatar`, {
            method: "PUT",
            body: formData
        });
        const result = await response.json();

        if (result.success) {
            toast.success("Foto profil berhasil diupdate!");
            // Update state tampilan langsung
            setUserData(prev => ({ ...prev, image: result.image }));
        } else {
            toast.error("Gagal upload foto");
        }
    } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan sistem");
    } finally {
        setUploadingAvatar(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  // --- Helper Functions UI ---
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "paid": return "bg-green-100 text-green-700";
      case "processing": return "bg-purple-100 text-purple-700";
      case "pending": case "waiting for payment": return "bg-orange-100 text-orange-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusIcon = (status) => {
    if (status === "Paid") return <CheckCircle size={14} className="text-green-500" />;
    return <Clock size={14} className="text-yellow-500" />;
  };

  const countStatus = (statusList) => orders.filter(o => statusList.includes(o.status)).length;

  // Dummy Address State (Visual Only)
  const [addresses] = useState([{ id: 1, label: "Rumah", name: userData.name, phone: "08123456789", province: "Jawa Barat", city: "Bekasi", street: "Jl. Grand Wisata", detail: "Cluster A", isPrimary: true }]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Password State
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [loadingPass, setLoadingPass] = useState(false);

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) return toast.error("Konfirmasi password tidak cocok!");
    
    setLoadingPass(true);
    try {
        const response = await fetch(`http://localhost:3001/api/users/${user.id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.new })
        });
        const result = await response.json();
        if (result.success) {
            toast.success("Password berhasil diubah!");
            setPasswordForm({ current: "", new: "", confirm: "" });
        } else {
            toast.error(result.message);
        }
    } catch (error) {
        toast.error("Gagal terhubung ke server");
    } finally {
        setLoadingPass(false);
    }
  };

  return (
    <div className="bg-[#FCFCFD] min-h-screen font-sans">
      <div className="container mx-auto max-w-[1200px] px-6 py-8">
        <h1 className="text-3xl font-extrabold text-dark mb-8">Akun Saya</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR (Profile Picture & Nav) */}
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 text-center border-b border-gray-100">
                
                {/* --- BAGIAN FOTO PROFIL (DIPERBARUI) --- */}
                <div className="relative w-24 h-24 mx-auto mb-4 group">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                        {uploadingAvatar ? (
                            <Loader2 className="animate-spin text-primary" size={32}/>
                        ) : userData.image ? (
                            <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-3xl font-bold text-gray-400">
                                {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                            </span>
                        )}
                    </div>
                    
                    {/* Tombol Upload (Label Input File) */}
                    <label 
                        htmlFor="avatar-upload" 
                        className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    >
                        <Camera size={24}/>
                    </label>
                    <input 
                        type="file" 
                        id="avatar-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={uploadingAvatar}
                    />
                </div>
                {/* --------------------------------------- */}

                <h3 className="font-bold text-lg text-dark truncate">{userData.name}</h3>
                <p className="text-sm text-gray truncate">{userData.email}</p>
              </div>
              
              <nav className="p-2 space-y-1">
                {[
                    { id: "overview", icon: User, label: "Ringkasan Akun" },
                    { id: "profile", icon: Edit2, label: "Profil Saya" },
                    { id: "address", icon: MapPin, label: "Alamat Pengiriman" },
                    { id: "orders", icon: Package, label: "Riwayat Pesanan" },
                    { id: "security", icon: Lock, label: "Keamanan & Password" },
                ].map(menu => (
                    <button
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                            activeTab === menu.id ? "bg-primary text-white font-bold shadow-md shadow-primary/20" : "text-gray hover:bg-gray-50"
                        }`}
                    >
                        <menu.icon size={18} /> {menu.label}
                    </button>
                ))}
                
                <Link to="/wishlist" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray hover:bg-gray-50 transition-colors">
                  <Heart size={18} /> Wishlist
                </Link>

                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-colors font-medium border-t border-gray-50 mt-2">
                  <LogOut size={18} /> Keluar Akun
                </button>
              </nav>
            </div>
          </div>

          {/* CONTENT AREA (SAMA SEPERTI SEBELUMNYA) */}
          <div className="col-span-1 lg:col-span-9">
            
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-dark">Status Pesanan</h3>
                    <button onClick={() => setActiveTab("orders")} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                      Lihat Semua <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    {[
                        { label: "Semua", count: orders.length, icon: FileText, color: "blue" },
                        { label: "Belum Bayar", count: countStatus(['pending', 'unpaid', 'waiting for payment']), icon: Wallet, color: "orange" },
                        { label: "Di Proses", count: countStatus(['paid', 'processing']), icon: Package, color: "purple" },
                        { label: "Dikirim", count: countStatus(['shipped']), icon: Truck, color: "yellow" },
                        { label: "Selesai", count: countStatus(['delivered']), icon: CheckCircle, color: "green" }
                    ].map((stat, idx) => (
                        <div key={idx} onClick={() => setActiveTab("orders")} className="flex flex-col items-center gap-2 group p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600 relative`}>
                                <stat.icon size={24}/>
                                {stat.count > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">{stat.count}</span>}
                            </div>
                            <span className="text-xs font-medium text-gray-600">{stat.label}</span>
                        </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-lg text-dark mb-6">Aktivitas Terakhir</h3>
                  {orders.length > 0 ? (
                    <div className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors bg-gray-50/50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray mb-1 font-mono">Order ID: {orders[0].id}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${getStatusColor(orders[0].status)}`}>
                              {orders[0].status}
                            </span>
                            <span className="text-xs text-gray font-medium">{orders[0].date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{formatCurrency(orders[0].total)}</p>
                        </div>
                      </div>
                      <Link to={`/order/${orders[0].realId}`} className="block text-center w-full bg-white text-dark border border-gray-200 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-50 transition shadow-sm">
                          Lihat Detail Pesanan
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">Belum ada aktivitas pesanan.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Edit Profil</h2>
                <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Username</label>
                      <input type="text" value={userData.username} disabled className="input-field bg-gray-100 cursor-not-allowed text-gray-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Nama Lengkap</label>
                      <input type="text" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Email</label>
                      <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">No. Telepon</label>
                      <input type="tel" value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={() => toast.success("Data disimpan (simulasi)")} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-primary/20">
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
                  <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-opacity-90 transition">
                    <Plus size={16} /> Tambah Alamat
                  </button>
                </div>
                {showAddressForm && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 animate-slide-in">
                        <h3 className="font-bold mb-2">Form Alamat</h3>
                        <p className="text-sm text-gray-500 mb-4">Fitur manajemen alamat lengkap akan hadir segera.</p>
                        <button onClick={() => setShowAddressForm(false)} className="text-red-500 font-bold text-sm">Tutup</button>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className={`bg-white p-6 rounded-2xl border ${addr.isPrimary ? "border-primary ring-1 ring-primary" : "border-gray-100"} hover:shadow-md transition relative group`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-dark flex items-center gap-2">{addr.label} {addr.isPrimary && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Utama</span>}</h4>
                          <p className="font-bold text-sm text-gray-700 mt-1">{addr.name}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-gray-100 rounded-lg text-gray hover:text-primary"><Edit2 size={14} /></button>
                        </div>
                      </div>
                      <p className="text-sm text-gray mb-1">{addr.phone}</p>
                      <p className="text-sm text-gray mb-1 leading-relaxed">{addr.street}, {addr.detail}<br />{addr.city}, {addr.province}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Riwayat Pesanan</h2>
                <div className="space-y-6">
                  {loadingOrders ? (
                      <div className="text-center py-12 text-gray-400 font-medium">Memuat Pesanan...</div>
                  ) : orders.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                          <Package size={48} className="text-gray-300 mx-auto mb-3"/>
                          <p className="text-gray-500">Belum ada pesanan.</p>
                          <Link to="/bookstore" className="text-primary font-bold hover:underline mt-2 inline-block">Belanja Sekarang</Link>
                      </div>
                  ) : (
                      orders.map((order) => (
                        <div key={order.realId} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all group bg-white">
                          <div className="flex flex-wrap justify-between items-start mb-6 pb-6 border-b border-gray-50">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-bold text-dark text-lg font-mono">{order.id}</span>
                                <span className="text-xs text-gray px-2 py-1 bg-gray-100 rounded-md">{order.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 flex items-center gap-1">
                                  {getPaymentStatusIcon(order.paymentStatus)} {order.paymentStatus}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 mt-4 md:mt-0">
                              {(order.status === "pending" || order.status === "waiting for payment") ? (
                                <Link to={`/payment/qris/${order.realId}`} className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90 transition shadow-lg shadow-primary/20">
                                  Bayar Sekarang
                                </Link>
                              ) : (
                                <Link to={`/invoice/${order.realId}`} className="text-primary text-sm font-bold flex items-center gap-1 group-hover:underline">
                                  Lihat Invoice <ChevronRight size={16} />
                                </Link>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Pesanan</span>
                            <span className="text-xl font-extrabold text-primary">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-fade-in max-w-2xl">
                <h2 className="text-xl font-bold mb-6">Ubah Password</h2>
                <form onSubmit={handleSavePassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Password Saat Ini</label>
                    <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Password Baru</label>
                    <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">Konfirmasi Password Baru</label>
                    <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className="input-field" required />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loadingPass} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-primary/20 disabled:opacity-50">
                      {loadingPass ? "Memproses..." : "Ubah Password"}
                    </button>
                  </div>
                </form>
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
            font-weight: 500;
            color: #1F2937;
        }
        .input-field:focus {
            border-color: #4F46E5;
            background-color: #FFFFFF;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
      `}</style>
    </div>
  );
};

export default UserDataPage;