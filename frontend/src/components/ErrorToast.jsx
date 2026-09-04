import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import styles from './ErrorToast.module.css';

export default function ErrorToast({ message, onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={styles.toast}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <FiAlertTriangle className={styles.icon} />
          <span className={styles.text}>{message}</span>
          <button className={styles.close} onClick={onClose} aria-label="Dismiss">
            <FiX />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}