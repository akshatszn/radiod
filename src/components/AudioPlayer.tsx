"use client";

import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function AudioPlayer() {
  const { currentTrack, isPlaying, play, pause, togglePlay, nextTrack, volume, setVolume } = usePlayerStore();
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle Play/Pause synchronization with Store
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
         audioRef.current.play().catch(() => pause());
      } else {
         audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, pause]);

  // Handle Volume synchronization with Store
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
       setProgress(audioRef.current.currentTime);
       setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    audioRef.current.currentTime = percent * duration;
    setProgress(percent * duration);
  };

  if (!currentTrack) {
    // Hidden completely when no track is loaded, or render an empty state?
    // Let's render an empty state to keep the footer persistent.
    return (
       <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '90px', background: 'rgba(5, 5, 5, 0.85)', borderTop: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '2rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
            No track playing right now
          </div>
       </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: '90px', 
      background: 'rgba(5, 5, 5, 0.85)', 
      borderTop: '1px solid var(--glass-border)', 
      backdropFilter: 'blur(20px)', 
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      padding: '0 2rem', 
      gap: '2rem' 
    }}>
      <audio 
         ref={audioRef}
         src={currentTrack.audioUrl}
         onTimeUpdate={handleTimeUpdate}
         onEnded={nextTrack}
         onLoadedMetadata={handleTimeUpdate}
         autoPlay
      />

      {/* Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', width: '30%', minWidth: '200px' }}>
         <img src={currentTrack.coverUrl || 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=100&q=80'} alt="album art" style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', marginRight: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', objectFit: 'cover' }} />
         <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
               {currentTrack.title}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
               {currentTrack.artist}
            </div>
         </div>
      </div>

      {/* Controls */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
           <button style={{ color: 'var(--text-muted)' }} onClick={() => {}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"></line></svg>
           </button>
           <button 
              onClick={togglePlay}
              style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform var(--transition-fast)' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              )}
           </button>
           <button style={{ color: 'var(--text-main)', transition: 'color var(--transition-fast)' }} onClick={nextTrack} onMouseOver={(e: any) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e: any) => e.currentTarget.style.color = 'var(--text-main)'}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"></line></svg>
           </button>
        </div>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
           <span style={{ fontVariantNumeric: 'tabular-nums' }}>
             {Math.floor(progress / 60)}:{(Math.floor(progress % 60)).toString().padStart(2, '0')}
           </span>
           <div onClick={handleSeek} style={{ flex: 1, height: '5px', background: 'var(--surface-hover)', borderRadius: '3px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: `${duration ? (progress / duration) * 100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '3px' }}></div>
           </div>
           <span style={{ fontVariantNumeric: 'tabular-nums' }}>
             {duration ? `${Math.floor(duration / 60)}:${(Math.floor(duration % 60)).toString().padStart(2, '0')}` : '--:--'}
           </span>
        </div>
      </div>

      {/* Volume & Extras */}
      <div style={{ width: '30%', minWidth: '200px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.25rem' }}>
         <button style={{ color: 'var(--text-muted)' }} title="Lyrics">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
         </button>
         <button style={{ color: 'var(--text-muted)' }} title="Volume">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
         </button>
         <div 
           style={{ width: '100px', height: '5px', background: 'var(--surface-hover)', borderRadius: '3px', cursor: 'pointer', position: 'relative' }}
           onClick={(e) => {
             const bounds = e.currentTarget.getBoundingClientRect();
             setVolume(Math.max(0, Math.min(100, ((e.clientX - bounds.left) / bounds.width) * 100)));
           }}
         >
            <div style={{ width: `${volume}%`, height: '100%', background: '#fff', borderRadius: '3px' }}></div>
         </div>
      </div>
    </div>
  );
}
