import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <div
      className="auth-layout"
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
      }}>
      <Outlet />
    </div>
  );
};
export default AuthLayout;