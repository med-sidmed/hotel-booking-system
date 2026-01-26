import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info';
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning' 
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const colors = {
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      icon: 'text-amber-500',
      button: 'bg-amber-500 hover:bg-amber-600'
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-500',
      button: 'bg-red-500 hover:bg-red-600'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600'
    }
  };

  const style = colors[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
        <div className={`p-6 ${style.bg} flex items-start gap-4`}>
          <div className={`${style.icon} p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm`}>
            <AlertTriangle size={24} />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-bold dark:text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/20">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-md active:scale-95 ${style.button}`}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
