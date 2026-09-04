import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <motion.button
      className={styles.toggle}
      onClick={() => setDark((d) => !d)}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className={styles.knob}
        animate={{ x: dark ? 0 : 24 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {dark ? <FiMoon size={14} /> : <FiSun size={14} />}
      </motion.div>
    </motion.button>
  );
}