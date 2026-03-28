import { searchMusic } from '../../../lib/musicApi';
import PlayTrackButton from '@/components/PlayTrackButton';
import PlaylistPlayButton from '@/components/PlaylistPlayButton';

export default async function ArtistProfile({ params }: { params: { name: string } }) {
  // Decode the URL parameter and fetch the artist's real global catalog!
  const decodedName = decodeURIComponent(params.name).replace(/-/g, ' ');
  const tracks = await searchMusic(decodedName, 10);
  
  // Use the first track's ultra high-res artwork as the background banner, fallback to a dark placeholder
  const artistImageUrl = tracks.length > 0 ? tracks[0].coverUrl : 'https://via.placeholder.com/1200x800/121212/333333?text=Artist+Cover';
  const displayArtistName = tracks.length > 0 ? tracks[0].artist : decodedName;

  const storeTracks = tracks.map(t => ({
    id: `itunes-${t.id}`,
    title: t.title,
    artist: t.artist,
    coverUrl: t.coverUrl,
    audioUrl: t.previewUrl || '',
    duration: Math.floor(t.durationMs / 1000)
  }));

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .play-btn {
          width: 64px; 
          height: 64px; 
          border-radius: 50%; 
          background: var(--accent); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 8px 32px var(--accent-glow); 
          transition: all var(--transition-fast);
        }
        .play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px var(--accent-glow); 
        }
        .track-row {
          display: flex; 
          align-items: center; 
          padding: 0.75rem 1.5rem; 
          border-radius: var(--radius-md); 
          transition: background var(--transition-fast); 
          cursor: pointer; 
          background: var(--glass-bg);
          border: 1px solid transparent;
        }
        .track-row:hover {
          background: var(--surface-hover);
          border: 1px solid var(--border-subtle);
        }
        audio {
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }
        audio::-webkit-media-controls-panel {
          background-color: var(--surface-hover);
        }
        audio::-webkit-media-controls-play-button {
          background-color: var(--accent);
          border-radius: 50%;
        }
        audio::-webkit-media-controls-current-time-display,
        audio::-webkit-media-controls-time-remaining-display {
          color: #fff;
          font-family: inherit;
        }
      `}} />
      
      {/* Hero Banner with immersive gradient fade into body */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '45vh', 
        minHeight: '400px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '3rem',
        backgroundImage: `linear-gradient(to top, var(--bg-color) 0%, rgba(5,5,5,0.4) 50%, rgba(0,0,0,0.1) 100%), url(${artistImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ background: 'var(--primary)', color: '#fff', padding: '0.2rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: '0 4px 12px var(--primary-glow)' }}>
              Verified Artist
            </span>
            <span style={{ color: 'var(--text-main)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
               {Math.floor(Math.random() * 5 + 1).toLocaleString()},{Math.floor(Math.random() * 900 + 100).toLocaleString()},000 Monthly Listeners
            </span>
          </div>
          <h1 style={{ fontSize: '5.5rem', fontWeight: 900, textShadow: '0 8px 32px rgba(0,0,0,0.9)', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {displayArtistName}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 3rem' }}>
        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
          <PlaylistPlayButton tracks={storeTracks} />
          <button className="btn-secondary" style={{ padding: '0.6rem 2rem', fontWeight: 600, fontSize: '1rem' }}>Follow</button>
          
          <div style={{ flex: 1 }} />
          <button style={{ color: 'var(--text-muted)' }}>•••</button>
        </div>

        {/* Popular Tracks */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <span style={{ color: 'var(--accent)' }}>●</span> Popular
        </h2>
        
        {tracks.length === 0 ? (
           <p style={{ color: 'var(--text-muted)' }}>No tracks found for this artist.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {storeTracks.map((track, index) => (
              <div key={track.id} className="track-row glass-panel">
                <div style={{ width: '2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.1rem' }}>{index + 1}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={track.coverUrl} alt={track.title} style={{ width: '52px', height: '52px', borderRadius: '6px', objectFit: 'cover', margin: '0 1.5rem 0 0', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
                
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>
                     {track.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                     {tracks[index].album}
                  </p>
                </div>

                {track.audioUrl && (
                    <PlayTrackButton track={track} queue={storeTracks} />
                )}
                
                <div style={{ color: 'var(--text-muted)', marginLeft: '2rem', fontWeight: 500, fontVariantNumeric: 'tabular-nums', width: '45px', textAlign: 'right' }}>
                  {Math.floor(tracks[index].durationMs / 60000)}:{(Math.floor((tracks[index].durationMs % 60000) / 1000)).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </main>
  );
}
