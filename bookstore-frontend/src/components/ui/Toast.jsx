import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  return (
    <div
      className={`fixed top-24 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${
        type === "success"
          ? "bg-white border-green-100 text-green-800 shadow-green-100/50"
          : "bg-white border-red-100 text-red-800 shadow-red-100/50"
      }`}>
      {type === "success" ? (
        <CheckCircle size={20} className="text-green-500 fill-green-50" />
      ) : (
        <XCircle size={20} className="text-red-500 fill-red-50" />
      )}
      <p className="font-bold text-sm pr-4">{message}</p>
      <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
    </div>
  );
};
export default Toast;