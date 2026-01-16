import { AlertTriangle, X } from "lucide-react";
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}></div>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-100 transform transition-all relative z-10 overflow-hidden">
        <div className="bg-amber-50 p-6 flex flex-col items-center justify-center border-b border-amber-100">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4 ring-8 ring-amber-50">
            <AlertTriangle size={32} strokeWidth={2.5} />
          </div>
          <h3 className="text-xl font-extrabold text-dark text-center">{title}</h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray leading-relaxed mb-8">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-bold text-gray hover:bg-gray-100 hover:text-gray-900 transition-colors">
              {cancelText || "Batal"}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-xl font-bold hover:bg-opacity-90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              {confirmText || "Ya, Lanjutkan"}
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
export default ConfirmationModal;