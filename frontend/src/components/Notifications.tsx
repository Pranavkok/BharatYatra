import React from 'react';
import { useGameStore } from '../game/store';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-amber-500',
};

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useGameStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const Icon = icons[notification.type];

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${colors[notification.type]}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[notification.type]}`} />
              <p className="flex-1 text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
