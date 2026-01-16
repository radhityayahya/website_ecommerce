import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  const value = {
    addToast,
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
  };
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto min-w-[300px] max-w-sm rounded-xl shadow-lg border p-4 flex items-start gap-3 animate-slide-in-right transition-all bg-white
              ${
                toast.type === "success"
                  ? "border-green-100 bg-green-50/80"
                  : toast.type === "error"
                  ? "border-red-100 bg-red-50/80"
                  : toast.type === "warning"
                  ? "border-orange-100 bg-orange-50/80"
                  : "border-blue-100 bg-blue-50/80"
              }
            `}>
            <div
              className={`mt-0.5 flex-shrink-0
              ${
                toast.type === "success"
                  ? "text-green-500"
                  : toast.type === "error"
                  ? "text-red-500"
                  : toast.type === "warning"
                  ? "text-orange-500"
                  : "text-blue-500"
              }
            `}>
              {toast.type === "success" && <CheckCircle size={20} />}
              {toast.type === "error" && <AlertCircle size={20} />}
              {toast.type === "warning" && <AlertCircle size={20} />}
              {toast.type === "info" && <Info size={20} />}
            </div>
            <p className="text-sm font-medium text-dark flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};