import { motion } from 'framer-motion';
import { FiZap, FiClock } from 'react-icons/fi';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ progress = 0, speed, eta }) {
  const clamped = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
        />
      </div>
      <div className={styles.meta}>
        <span className={styles.percent}>{clamped.toFixed(0)}%</span>
        {speed && (
          <span className={styles.metaItem}>
            <FiZap size={12} /> {speed}
          </span>
        )}
        {eta && eta !== 'Unknown' && (
          <span className={styles.metaItem}>
            <FiClock size={12} /> ETA {eta}
          </span>
        )}
      </div>
    </div>
  );
}