import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;