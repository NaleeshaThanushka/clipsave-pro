import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiFilm, FiMusic, FiDownload, FiInbox } from 'react-icons/fi';
import { formatTimeAgo } from '../utils/format';
import { getFileUrl } from '../services/api';
import styles from './DownloadHistory.module.css';

export default function DownloadHistory({ items }) {
  const completed = items.filter((i) => i.status === 'completed');

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Download History</h2>

      {completed.length === 0 ? (
        <div className={styles.empty}>
          <FiInbox size={28} />
          <p>Your completed downloads will show up here.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          <AnimatePresence>
            {completed.map((item) => {
              const FormatIcon = item.format === 'mp3' ? FiMusic : FiFilm;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  whileHover={{ y: -4 }}
                  className={styles.card}
                >
                  <div className={styles.thumbWrap}>
                    {item.meta?.thumbnail ? (
                      <img src={item.meta.thumbnail} alt={item.meta?.title} className={styles.thumb} />
                    ) : (
                      <div className={styles.thumbFallback}>
                        <FormatIcon size={22} />
                      </div>
                    )}
                    <span className={styles.formatBadge}>{item.format?.toUpperCase()}</span>
                  </div>
                  <div className={styles.body}>
                    <p className={styles.title} title={item.meta?.title}>
                      {item.meta?.title || item.url}
                    </p>
                    <span className={styles.time}>
                      <FiClock size={11} /> {formatTimeAgo(item.completedAt)}
                    </span>
                    <a href={getFileUrl(item.id)} className={styles.link} download>
                      <FiDownload /> Download
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}