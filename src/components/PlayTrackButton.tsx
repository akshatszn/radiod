"use client";

import { usePlayerStore, Track } from '@/store/usePlayerStore';

export default function PlayTrackButton({ track, queue }: { track: Track; queue: Track[] }) {
  const { playTrack, setQueue, currentTrack, isPlaying, pause } = usePlayerStore();

  const isCurrent = currentTrack?.id === track.id;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCurrent && isPlaying) {
      pause();
    } else {
      // Find track index to set queue from this point onward
      const index = queue.findIndex(t => t.id === track.id);
      if (index !== -1) {
        setQueue(queue.slice(index + 1));
      } else {
        setQueue(queue);
      }
      playTrack(track);
    }
  };

  return (
    <button 
      onClick={handlePlay}
      style={{ 
        width: '36px', height: '36px', borderRadius: '50%', background: isCurrent ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s', marginLeft: '1rem'
      }}
      title={isCurrent && isPlaying ? "Pause" : "Play"}
    >
      {isCurrent && isPlaying ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
      )}
    </button>
  );
}
