import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const states = ['DRAFTING...', 'RECONCILING...', 'POLISHING...'];
export function ProgressIndicator() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStateIndex((prevIndex) => (prevIndex + 1) % states.length);
    }, 2000); // Cycle through states every 2 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <AnimatePresence mode="wait">
        <motion.h1
          key={currentStateIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-8xl font-display font-bold text-center"
        >
          {states[currentStateIndex]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}