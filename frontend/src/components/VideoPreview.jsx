import { motion } from 'framer-motion';
import { FiUser, FiClock, FiEye, FiImage } from 'react-icons/fi';
import { formatDuration, formatViews } from '../utils/format';
import styles from './VideoPreview.module.css';

export default function VideoPreview({ info }) {
  if (!info) return null;

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.thumbWrap}>
        {info.thumbnail ? (
          <img src={info.thumbnail} alt={info.title} className={styles.thumb} />
        ) : (
          <div className={styles.thumbFallback}>
            <FiImage size={32} />
          </div>
        )}
        <span className={styles.durationBadge}>{formatDuration(info.duration)}</span>
      </div>

      <div className={styles.details}>
        <h3 className={styles.title}>{info.title}</h3>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <FiUser /> {info.uploader}
          </span>
          <span className={styles.metaItem}>
            <FiClock /> {formatDuration(info.duration)}
          </span>
          {info.viewCount != null && (
            <span className={styles.metaItem}>
              <FiEye /> {formatViews(info.viewCount)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}