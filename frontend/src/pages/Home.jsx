import { useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import DownloadForm from '../components/DownloadForm';
import VideoPreview from '../components/VideoPreview';
import DownloadQueue from '../components/DownloadQueue';
import DownloadHistory from '../components/DownloadHistory';
import ErrorToast from '../components/ErrorToast';
import useSocket from '../hooks/useSocket';
import { fetchVideoInfo, startDownload } from '../services/api';
import styles from './Home.module.css';

export default function Home() {
  const { connected, queue, history } = useSocket();
  const [previewInfo, setPreviewInfo] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const showError = useCallback((message) => {
    setErrorMsg(message);
    // auto-dismiss after 5s
    window.clearTimeout(showError._t);
    showError._t = window.setTimeout(() => setErrorMsg(''), 5000);
  }, []);

  const handlePreview = async (url) => {
    setPreviewLoading(true);
    setPreviewInfo(null);
    try {
      const info = await fetchVideoInfo(url);
      setPreviewInfo(info);
    } catch (err) {
      showError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = async (payload) => {
    setDownloadLoading(true);
    try {
      await startDownload(payload);
      setPreviewInfo(null); // clear preview once queued
    } catch (err) {
      showError(err.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  // combine live socket queue + history for the history section
  // (queue items that reach 'completed' already get pushed into `history`
  // by useSocket, but we also merge queue's own completed items defensively)
  const completedFromQueue = queue.filter((i) => i.status === 'completed');
  const historyMap = new Map();
  [...history, ...completedFromQueue].forEach((item) => historyMap.set(item.id, item));
  const mergedHistory = Array.from(historyMap.values()).sort(
    (a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0)
  );

  return (
    <div className={styles.page}>
      <Navbar connected={connected} />
      <Hero />

      <main className={styles.main}>
        <DownloadForm
          onPreview={handlePreview}
          onDownload={handleDownload}
          loading={previewLoading || downloadLoading}
        />

        <VideoPreview info={previewInfo} />

        <DownloadQueue items={queue} />
      </main>

      <DownloadHistory items={mergedHistory} />

      <ErrorToast message={errorMsg} onClose={() => setErrorMsg('')} />
    </div>
  );
}