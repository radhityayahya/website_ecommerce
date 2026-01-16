import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Book, ShoppingBag, CreditCard, LogOut, Package } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  // Helper untuk mengecek active route (termasuk sub-route jika perlu)
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/products", label: "Products", icon: Book },
    { path: "/admin/purchases", label: "Purchases", icon: Package },
    { path: "/admin/sales", label: "Sales History", icon: ShoppingBag },
    { path: "/admin/invoices", label: "Invoices", icon: CreditCard },
  ];

  return (
    <aside className="w-[250px] bg-surface border-r border-gray/20 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Header */}
      <div className="p-6 border-b border-gray/20">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <LayoutDashboard size={24} /> 
          Admin Panel
        </h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    active
                      ? "bg-primary text-white shadow-lg shadow-primary/30"
                      : "text-gray-500 hover:bg-primary-light hover:text-primary"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray/20">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-danger hover:bg-red-50 transition-colors text-sm font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;