import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-background text-dark font-sans">
      <Sidebar />
      <main className="flex-1 ml-[250px] p-8 min-h-screen bg-background">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;