import { useEffect } from "react";
import { motion } from "framer-motion";

function SplashScreen({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 flex flex-col items-center justify-center text-white"
    >

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl mb-6"
      >
        <h1 className="text-5xl font-bold">₹</h1>
      </motion.div>

      {/* App Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-4xl font-bold tracking-wide"
      >
        FinTrack
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1 }}
        className="mt-3 text-sm"
      >
        Track Smarter. Spend Better.
      </motion.p>

      {/* Loader */}
      <div className="mt-10 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
        <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:0.4s]"></div>
      </div>

    </motion.div>
  );
}

export default SplashScreen;