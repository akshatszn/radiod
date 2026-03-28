"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePlaylistButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My New Playlist' })
      });
      
      const data = await res.json();
      if (data.success && data.playlist) {
        router.refresh(); // Refresh the library view to show the new playlist
        // Optional: router.push(`/playlist/${data.playlist.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCreate} 
      disabled={loading}
      className="btn-accent" 
      style={{ padding: '0.8rem 2rem', fontSize: '1.05rem', boxShadow: '0 4px 16px var(--accent-glow)', opacity: loading ? 0.7 : 1 }}
    >
      {loading ? 'Creating...' : '+ Create Playlist'}
    </button>
  );
}
