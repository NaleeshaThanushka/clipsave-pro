import { motion } from 'framer-motion';
import { FiZap, FiYoutube, FiInstagram, FiFacebook, FiMusic } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import styles from './Hero.module.css';

const platforms = [
  { icon: FiYoutube, label: 'YouTube' },
  { icon: SiTiktok, label: 'TikTok' },
  { icon: FiInstagram, label: 'Instagram' },
  { icon: FiFacebook, label: 'Facebook' }
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.badge}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiZap /> Fast. Free. No watermarks.
      </motion.div>

      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Download Any Video, <span className={styles.gradient}>Instantly.</span>
      </motion.h1>

      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Paste a link from YouTube, TikTok, Instagram, or Facebook. Preview it,
        trim the exact clip you want, and download as MP4 or MP3 — with live progress.
      </motion.p>

      <motion.div
        className={styles.platforms}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {platforms.map(({ icon: Icon, label }) => (
          <span key={label} className={styles.platformPill}>
            <Icon /> {label}
          </span>
        ))}
        <span className={styles.platformPill}>
          <FiMusic /> + more
        </span>
      </motion.div>
    </section>
  );
}