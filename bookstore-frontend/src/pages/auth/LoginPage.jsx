import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Rocket, Apple } from "lucide-react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogin, setKeepLogin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Tambah state loading
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => { // Ubah jadi async
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Tunggu hasil login dari server (await)
      const result = await login(username, password);
      
      if (result.success) {
        // Cek role user untuk redirect yang sesuai
        // Kita ambil user dari result logic AuthContext jika perlu, 
        // tapi di sini kita bisa cek username sementara atau redirect ke home dulu
        if (username === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
      } else {
        setError(result.message || "Username atau password salah");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F0FE] to-[#F0E8FE] relative overflow-hidden">
      <nav className="absolute top-0 left-0 w-full px-8 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="text-[#4A5FFF] font-bold">
            Home
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-[#4A5FFF] font-bold border-b-2 border-[#4A5FFF] pb-1">
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-white px-6 py-2 rounded-full font-bold text-gray-800 shadow-sm hover:shadow-md transition-shadow">
            Register
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-8 min-h-screen flex items-center justify-between pt-20">
        <div className="w-1/2 pr-16">
          <h1 className="text-6xl font-extrabold text-[#4A5FFF] mb-4 leading-tight">
            Welcome to our
            <br />
            Community
          </h1>
          <p className="text-gray-600 text-lg mb-12 max-w-md">
            A whole new productive journey starts right here
          </p>
          <div className="relative w-full max-w-lg h-96 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="relative animate-float">
                <Rocket
                  size={280}
                  className="text-[#6B7FFF] transform rotate-45"
                  strokeWidth={1.5}
                  fill="#E8F0FE"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 max-w-md">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-sm font-bold">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A5FFF]/20 transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A5FFF]/20 transition-all"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepLogin}
                  onChange={() => setKeepLogin(!keepLogin)}
                  className="w-4 h-4 rounded border-gray-300 text-[#4A5FFF] focus:ring-[#4A5FFF]"
                />
                <span className="text-gray-700 font-medium">Keep me login</span>
              </label>
              <Link to="#" className="text-gray-600 hover:text-gray-900 font-medium">
                Recovery Password
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4A5FFF] hover:bg-[#3D4FE6] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
          
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#4A5FFF] font-bold hover:underline">
              Sign up now
            </Link>
          </p>
          <div className="mt-8 text-center bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/60">
            <p className="text-xs text-gray-500 font-semibold mb-1">Server Status:</p>
            <p className="text-xs text-green-600 font-mono font-bold">Connected to Database</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;