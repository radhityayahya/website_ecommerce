import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Rocket, Apple } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi dasar
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok!");
      return;
    }
    if (!agreeTerms) {
      toast.error("Mohon setujui Syarat dan Ketentuan");
      return;
    }

    setIsLoading(true);

    try {
      // Panggil API Backend
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Registrasi berhasil! Silakan login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Registrasi gagal");
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F0FE] to-[#F0E8FE] relative overflow-hidden">
      <nav className="absolute top-0 left-0 w-full px-8 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/" className="text-[#4A5FFF] font-bold">Home</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-700 font-medium hover:text-gray-900">Sign In</Link>
          <Link to="/register" className="bg-white px-6 py-2 rounded-full font-bold text-gray-800 shadow-sm hover:shadow-md transition-shadow">Register</Link>
        </div>
      </nav>
      <div className="container mx-auto px-8 min-h-screen flex items-center justify-between pt-20">
        <div className="w-1/2 pr-16">
          <h1 className="text-6xl font-extrabold text-[#4A5FFF] mb-4 leading-tight">
            Join Our <br /> Community
          </h1>
          <p className="text-gray-600 text-lg mb-12 max-w-md">
            Create your account and start your amazing reading journey today
          </p>
          {/* Ilustrasi Rocket */}
          <div className="relative w-full max-w-lg h-96 mb-8">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-200/40 to-blue-200/40 rounded-full blur-3xl"></div>
             <div className="relative z-10 flex items-center justify-center h-full">
               <Rocket size={280} className="text-[#6B7FFF] transform -rotate-12" strokeWidth={1.5} fill="#E8F0FE" />
             </div>
          </div>
        </div>
        
        {/* Form Register */}
        <div className="w-1/2 max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A5FFF]/20 transition-all"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A5FFF]/20 transition-all"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A5FFF]/20 transition-all"
                placeholder="Create a password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border-0 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A5FFF]/20 transition-all"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <label className="flex items-start gap-3 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#4A5FFF] focus:ring-[#4A5FFF]"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4A5FFF] hover:bg-[#3D4FE6] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Creating Account..." : "CREATE ACCOUNT"}
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#4A5FFF] font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;