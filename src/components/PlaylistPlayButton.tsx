"use client";

import { usePlayerStore, Track } from '@/store/usePlayerStore';

export default function PlaylistPlayButton({ tracks }: { tracks: Track[] }) {
  const { playTrack, setQueue } = usePlayerStore();

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      const firstTrack = tracks[0];
      setQueue(tracks.slice(1));
      playTrack(firstTrack);
    }
  };

  return (
    <button className="play-btn" onClick={handlePlayAll}>
       <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: '4px' }}>
         <polygon points="5 3 19 12 5 21 5 3"></polygon>
       </svg>
    </button>
  );
}
