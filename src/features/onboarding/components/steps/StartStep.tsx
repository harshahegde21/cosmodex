import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface StartStepProps {
  onNext: () => void;
}

export default function StartStep({ onNext }: StartStepProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 pointer-events-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h1 className="text-5xl sm:text-6xl font-display font-bold tracking-tight text-white drop-shadow-lg">
          Welcome to <br />
          Cosmodex
        </h1>
        <p className="text-cosmo-text-muted text-lg max-w-sm mx-auto leading-relaxed">
          Your journey through the digital universe starts here. Let&apos;s set up your command center.
        </p>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="cosmo-btn-primary px-10 py-4 uppercase text-sm tracking-widest relative group overflow-hidden border-2"
      >
        <span className="relative z-10 font-display">Initiate Sequence</span>
        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
