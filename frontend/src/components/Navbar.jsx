import { motion } from 'framer-motion';
import { FiFilm } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

export default function Navbar({ connected }) {
  return (
    <motion.nav
      className={styles.nav}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <FiFilm />
        </div>
        <span className={styles.brandText}>
          ClipSave <span className={styles.brandAccent}>Pro</span>
        </span>
      </div>

      <div className={styles.right}>
        <span className={styles.statusDot}>
          <span className={`${styles.dot} ${connected ? styles.dotOn : styles.dotOff}`} />
          {connected ? 'Live' : 'Offline'}
        </span>
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}