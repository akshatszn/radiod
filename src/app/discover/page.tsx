import Link from 'next/link';
import { searchMusic } from '../../lib/musicApi';
import PlayTrackButton from '@/components/PlayTrackButton';

export default async function DiscoverPage() {
  // Mock AI recommended tracks based on "user preferences"
  const recommendedTracks = await searchMusic('electronic dance', 12);
  
  const moods = [
    { name: 'Late Night Drives', emoji: '🌙', color: 'linear-gradient(135deg, #1e3c72, #2a5298)' },
    { name: 'Pure Focus', emoji: '🧠', color: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
    { name: 'Workout Hype', emoji: '🔥', color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
    { name: 'Chill Vibes', emoji: '☕', color: 'linear-gradient(135deg, #e65c00, #F9D423)' },
    { name: 'Main Character', emoji: '🎬', color: 'linear-gradient(135deg, #8A2387, #E94057, #F27121)' },
    { name: 'Cyberpunk', emoji: '🤖', color: 'linear-gradient(135deg, #00C9FF, #92FE9D)' },
  ];

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
       
       <style dangerouslySetInnerHTML={{__html: `
         .mood-card { transition: all var(--transition-smooth); cursor: pointer; }
         .mood-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 16px 40px rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.2); }
         .search-input::placeholder { color: var(--text-muted); }
         .search-input:focus { border-color: var(--accent) !important; outline: none; }
       `}} />

       <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>Discover</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem' }}>Powered by our next-gen acoustic AI engine.</p>
          
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
             <svg style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             <input className="search-input" type="text" placeholder="Search artists, tracks, playlists, or users..." style={{ width: '100%', padding: '1.5rem 1.5rem 1.5rem 4rem', fontSize: '1.2rem', borderRadius: 'var(--radius-full)', border: '2px solid var(--border-subtle)', background: 'var(--glass-bg)', color: 'var(--text-main)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', transition: 'border var(--transition-fast)' }} />
             <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'var(--surface-hover)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-lg)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Ctrl K</div>
          </div>
       </div>

       {/* Mood & Genre AI Filters */}
       <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
         <span style={{ color: 'var(--primary)' }}>●</span> AI Mood & Genre Spaces
       </h2>
       
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {moods.map(mood => (
             <div key={mood.name} className="mood-card" style={{ background: mood.color, borderRadius: 'var(--radius-lg)', padding: '1.5rem', minHeight: '160px', border: '2px solid transparent', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', right: '-15px', bottom: '-20px', fontSize: '7rem', opacity: 0.2, transform: 'rotate(15deg)' }}>{mood.emoji}</div>
                <div style={{ fontSize: '2rem', zIndex: 1 }}>{mood.emoji}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.4)', zIndex: 1, lineHeight: 1.2 }}>{mood.name}</h3>
             </div>
          ))}
       </div>

       {/* Personalized AI Recommendations */}
       <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
         <span style={{ color: 'var(--accent)' }}>✦</span> Curated For You
       </h2>
       <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Our AI analyzed your recent listens and generated this dynamic feed.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {recommendedTracks.map((apiTrack) => {
            const track = {
              id: `itunes-${apiTrack.id}`,
              title: apiTrack.title,
              artist: apiTrack.artist,
              coverUrl: apiTrack.coverUrl,
              audioUrl: apiTrack.previewUrl || '',
              duration: Math.floor((apiTrack.durationMs || 0) / 1000)
            };
            
            return (
              <div key={track.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'transform var(--transition-fast)' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={track.coverUrl || 'https://via.placeholder.com/600'} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.2rem 0.6rem', border: '1px solid rgba(0,229,255,0.4)', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent)', backdropFilter: 'blur(8px)', textTransform: 'uppercase' }}>
                    {90 + Math.floor(Math.random() * 9)}% Match
                  </div>
                  {track.audioUrl && (
                    <div style={{ zIndex: 10, position: 'absolute', bottom: '0.5rem', right: '0.5rem' }}>
                      <PlayTrackButton track={track} queue={[track]} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.title}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
    </main>
  );
}
