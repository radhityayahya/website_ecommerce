import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Inisialisasi navigate

  useEffect(() => {
    const storedUser = localStorage.getItem("bookstore_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("bookstore_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: "Gagal terhubung ke server" };
    }
  };

  // 3. Update fungsi logout agar melakukan redirect
  const logout = () => {
    setUser(null);
    localStorage.removeItem("bookstore_user");
    navigate("/login"); // Arahkan kembali ke halaman login
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};