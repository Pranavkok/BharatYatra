import React from 'react';
import { useGameStore } from '../game/store';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';

export const RegionInfoModal: React.FC = () => {
  const { showRegionInfo, setShowRegionInfo } = useGameStore();

  if (!showRegionInfo) return null;

  const handleClose = () => {
    setShowRegionInfo(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{showRegionInfo.nodeName}</h2>
                <p className="text-white/80 text-sm">Learn about this place</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {showRegionInfo.info}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium hover:from-green-600 hover:to-teal-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
