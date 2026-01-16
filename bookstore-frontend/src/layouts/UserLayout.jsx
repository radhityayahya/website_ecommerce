import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
const UserLayout = () => {
  const location = useLocation();
  const { pathname } = location;
  const hideFooter =
    pathname === "/checkout" ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/order/success") ||
    pathname === "/shipping";
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
export default UserLayout;