import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { setToastHandler, type ToastType } from '../lib/toastBus';

type ToastItem = {
    id: number;
    type: ToastType;
    title: string;
    message?: string;
};

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const colors = {
    success: { border: 'border-emerald-500/30', icon: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    error: { border: 'border-red-500/30', icon: 'text-red-400', bg: 'bg-red-500/10' },
    warning: { border: 'border-yellow-500/30', icon: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    info: { border: 'border-blue-500/30', icon: 'text-blue-400', bg: 'bg-blue-500/10' },
};

let toastIdCounter = 0;

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = ++toastIdCounter;
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    useEffect(() => {
        setToastHandler(addToast);
        return () => { setToastHandler(null); };
    }, [addToast]);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col-reverse gap-2 items-center pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const Icon = icons[toast.type];
                    const color = colors[toast.type];
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                            className={`premium-toast-shell pointer-events-auto min-w-[340px] max-w-md ${color.border}`}
                        >
                            <div className="premium-toast-progress" />
                            <div className="relative z-10 flex items-center gap-3 px-4 py-3">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 ${color.bg}`}>
                                    <Icon size={18} className={color.icon} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="text-sm font-semibold text-white">{toast.title}</div>
                                        <span className="premium-chip" data-tone={toast.type === 'error' ? 'danger' : toast.type === 'warning' ? 'warning' : toast.type === 'success' ? 'success' : 'info'}>{toast.type}</span>
                                    </div>
                                    {toast.message && <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{toast.message}</div>}
                                </div>
                                <button onClick={() => removeToast(toast.id)} className="flex h-8 w-8 items-center justify-center rounded-xl surface-interactive">
                                    <X size={14} className="text-gray-500" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
