import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiDownloadCloud, FiCheckCircle, FiXCircle, FiFilm, FiMusic, FiDownload } from 'react-icons/fi';
import ProgressBar from './ProgressBar';
import { getFileUrl } from '../services/api';
import styles from './DownloadQueue.module.css';

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: FiClock, className: 'badgePending' },
  downloading: { label: 'Downloading', icon: FiDownloadCloud, className: 'badgeDownloading' },
  completed: { label: 'Completed', icon: FiCheckCircle, className: 'badgeCompleted' },
  failed: { label: 'Failed', icon: FiXCircle, className: 'badgeFailed' }
};

function QueueCard({ item }) {
  const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
  const StatusIcon = config.icon;
  const FormatIcon = item.format === 'mp3' ? FiMusic : FiFilm;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={styles.card}
    >
      <div className={styles.cardTop}>
        <div className={styles.cardInfo}>
          <FormatIcon className={styles.formatIcon} />
          <div className={styles.textCol}>
            <p className={styles.title} title={item.url}>
              {item.meta?.title || item.url}
            </p>
            <span className={styles.format}>{item.format?.toUpperCase()}</span>
          </div>
        </div>
        <span className={`${styles.badge} ${styles[config.className]}`}>
          <StatusIcon size={13} /> {config.label}
        </span>
      </div>

      {item.status === 'downloading' && (
        <ProgressBar progress={item.progress} speed={item.speed} eta={item.eta} />
      )}

      {item.status === 'failed' && item.error && (
        <p className={styles.errorText}>{item.error}</p>
      )}

      {item.status === 'completed' && (
        <a href={getFileUrl(item.id)} className={styles.downloadLink} download>
          <FiDownload /> Save file
        </a>
      )}
    </motion.div>
  );
}

export default function DownloadQueue({ items }) {
  const active = items.filter(
    (i) => i.status === 'pending' || i.status === 'downloading' || i.status === 'failed'
  );

  if (active.length === 0) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Download Queue</h2>
      <div className={styles.list}>
        <AnimatePresence>
          {active.map((item) => (
            <QueueCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}