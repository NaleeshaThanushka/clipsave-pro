import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLink, FiClock, FiFilm, FiMusic, FiSearch, FiDownload, FiList, FiX } from 'react-icons/fi';
import styles from './DownloadForm.module.css';

const TIME_PLACEHOLDER = '00:00:00';

export default function DownloadForm({ onPreview, onDownload, loading }) {
  const [mode, setMode] = useState('single'); // single | batch
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState('');
  const [format, setFormat] = useState('mp4');
  const [useClip, setUseClip] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formError, setFormError] = useState('');

  const validateTime = (value) => value === '' || /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/.test(value);

  const handlePreview = (e) => {
    e.preventDefault();
    setFormError('');
    if (!url.trim()) {
      setFormError('Please paste a video URL first.');
      return;
    }
    onPreview(url.trim());
  };

  const handleDownload = (e) => {
    e.preventDefault();
    setFormError('');

    if (useClip) {
      if (!validateTime(startTime) || !validateTime(endTime)) {
        setFormError('Time must be in HH:MM:SS format, e.g. 00:01:30.');
        return;
      }
    }

    if (mode === 'batch') {
      if (!urls.trim()) {
        setFormError('Add at least one URL (one per line).');
        return;
      }
      onDownload({ urls, format, startTime: useClip ? startTime : '', endTime: useClip ? endTime : '' });
      setUrls('');
    } else {
      if (!url.trim()) {
        setFormError('Please paste a video URL first.');
        return;
      }
      onDownload({ url: url.trim(), format, startTime: useClip ? startTime : '', endTime: useClip ? endTime : '' });
    }
  };

  return (
    <motion.form
      className={styles.card}
      onSubmit={handleDownload}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.modeSwitch}>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'single' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('single')}
        >
          <FiLink /> Single URL
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'batch' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('batch')}
        >
          <FiList /> Multiple URLs
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'single' ? (
          <motion.div
            key="single"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.inputRow}
          >
            <div className={styles.inputWrap}>
              <FiLink className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Paste a YouTube, TikTok, Instagram, or Facebook link..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={styles.input}
              />
            </div>
            <motion.button
              type="button"
              className={styles.previewBtn}
              onClick={handlePreview}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
            >
              <FiSearch /> Preview
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="batch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <textarea
              className={styles.textarea}
              placeholder={'https://youtube.com/...\nhttps://tiktok.com/...\nhttps://facebook.com/...\n(one URL per line)'}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={5}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.optionsRow}>
        <div className={styles.formatToggle}>
          <button
            type="button"
            className={`${styles.formatBtn} ${format === 'mp4' ? styles.formatBtnActive : ''}`}
            onClick={() => setFormat('mp4')}
          >
            <FiFilm /> MP4
          </button>
          <button
            type="button"
            className={`${styles.formatBtn} ${format === 'mp3' ? styles.formatBtnActive : ''}`}
            onClick={() => setFormat('mp3')}
          >
            <FiMusic /> MP3
          </button>
        </div>

        <label className={styles.clipToggle}>
          <input type="checkbox" checked={useClip} onChange={(e) => setUseClip(e.target.checked)} />
          <FiClock /> Trim clip
        </label>
      </div>

      <AnimatePresence>
        {useClip && (
          <motion.div
            className={styles.clipRow}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.timeField}>
              <span>Start</span>
              <input
                type="text"
                placeholder={TIME_PLACEHOLDER}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                maxLength={8}
              />
            </div>
            <div className={styles.timeField}>
              <span>End</span>
              <input
                type="text"
                placeholder={TIME_PLACEHOLDER}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                maxLength={8}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formError && (
          <motion.div
            className={styles.errorBox}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <FiX /> {formError}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        className={styles.downloadBtn}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
      >
        <FiDownload /> {loading ? 'Queuing...' : 'Download'}
      </motion.button>
    </motion.form>
  );
}