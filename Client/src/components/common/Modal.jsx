import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#06161B]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidth} bg-[#0c222a] border border-[#143542] rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#143542] shrink-0">
          <h3 className="text-lg font-bold text-[#E5E7E7] font-display">{title}</h3>
          <button
            onClick={onClose}
            className="text-[#E5E7E7]/60 hover:text-[#0AE3DA] p-1 rounded-lg hover:bg-[#143542] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0AE3DA]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto text-[#E5E7E7]/90 space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

