export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import CommentSection from '@/components/CommentSection';
import PlayTrackButton from '@/components/PlayTrackButton';
import PlaylistPlayButton from '@/components/PlaylistPlayButton';

export default async function PlaylistPage({ params }: { params: { id: string } }) {
  const playlist = await prisma.playlist.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      },
      songs: {
        include: {
          song: {
            include: { artist: true }
          }
        }
      }
    }
  });

  if (!playlist) {
    notFound();
  }

  const tracks = playlist.songs.map((ps: any) => ({
    id: ps.song.id,
    title: ps.song.title,
    artist: ps.song.artist?.name || 'Unknown Artist',
    coverUrl: ps.song.coverArtUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop',
    audioUrl: ps.song.audioUrl,
    duration: ps.song.duration
  }));
  const cover = playlist.coverArtUrl || 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80';
  const playlistTitle = playlist.name;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .play-btn {
          width: 72px; 
          height: 72px; 
          border-radius: 50%; 
          background: var(--primary); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 8px 32px var(--primary-glow); 
          transition: all var(--transition-fast);
        }
        .play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px var(--primary-glow); 
        }
        .track-row {
          display: flex; 
          align-items: center; 
          padding: 0.75rem 1.5rem; 
          border-radius: var(--radius-md); 
          transition: background var(--transition-fast); 
          cursor: pointer; 
          background: transparent;
          border: 1px solid transparent;
        }
        .track-row:hover {
          background: var(--glass-bg);
          border: 1px solid var(--border-subtle);
        }
        audio {
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }
        audio::-webkit-media-controls-panel {
          background-color: var(--surface-hover);
        }
        audio::-webkit-media-controls-play-button {
          background-color: var(--primary);
          border-radius: 50%;
        }
        audio::-webkit-media-controls-current-time-display,
        audio::-webkit-media-controls-time-remaining-display {
          color: #fff;
          font-family: inherit;
        }
      `}} />
      
      {/* Hero Banner Header */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '45vh', 
        minHeight: '400px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '3rem',
        backgroundImage: `linear-gradient(to top, var(--bg-color) 0%, rgba(5,5,5,0.7) 50%, rgba(0,0,0,0.4) 100%), url(${cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', gap: '3rem', alignItems: 'flex-end' }}>
          
          <div style={{ width: '250px', height: '250px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.8)' }}>
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={cover} alt="Playlist Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Curated Playlist
              </span>
            </div>
            <h1 style={{ fontSize: '5.5rem', fontWeight: 900, textShadow: '0 8px 32px rgba(0,0,0,0.9)', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-main)' }}>
              {playlistTitle}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>Featuring {tracks.length} tracks • Created by Radiod User</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 3rem' }}>
        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <PlaylistPlayButton tracks={tracks} />
          
          <button style={{ color: 'var(--text-muted)' }} title="Like/Save Playlist">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button style={{ color: 'var(--text-muted)' }} title="Share">•••</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
           <div style={{ display: 'flex', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1.5rem 0.5rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
             <div style={{ width: '2rem' }}>#</div>
             <div style={{ flex: 1 }}>Title</div>
             <div style={{ width: '45px', textAlign: 'right' }}>Time</div>
           </div>

          {tracks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <p>This playlist is currently empty. Add some tracks!</p>
            </div>
          ) : tracks.map((track: any, index: number) => (
            <div key={track.id} className="track-row">
              <div style={{ width: '2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '1rem' }}>{index + 1}</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={track.coverUrl} alt={track.title} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover', margin: '0 1.5rem 0 0', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
              
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                   {track.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                   {track.artist}
                </p>
              </div>

              {track.audioUrl && (
                  <PlayTrackButton track={track} queue={tracks} />
              )}
              
              <div style={{ color: 'var(--text-muted)', marginLeft: '2rem', fontWeight: 500, fontVariantNumeric: 'tabular-nums', width: '45px', textAlign: 'right' }}>
                {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '--:--'}
              </div>
            </div>
          ))}
        </div>
        
        {/* Comments Section */}
        <CommentSection initialComments={playlist.comments} playlistId={playlist.id} />

      </div>
    </main>
  );
}
