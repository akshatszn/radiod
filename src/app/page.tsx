import { getTrendingMusic } from '../lib/musicApi';
import Link from 'next/link';
import AuthButton from '../components/AuthButton';
import PlayTrackButton from '@/components/PlayTrackButton';

export default async function Home() {
  // Fetch real data directly in the server component!
  const trendingTracks = await getTrendingMusic();

  return (
    <main style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto' }}>
      <nav className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>RADIOD</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/discover"><button className="btn-secondary" style={{ border: 'none', background: 'transparent', color: 'var(--accent)' }}>Discover</button></Link>
          <Link href="/library"><button className="btn-secondary" style={{ border: 'none', background: 'transparent' }}>Your Library</button></Link>
          <Link href="/community"><button className="btn-secondary" style={{ border: 'none', background: 'transparent' }}>Community</button></Link>
          <Link href="/dashboard"><button className="btn-secondary">Artist Dashboard</button></Link>
          <AuthButton />
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginBottom: '6rem' }}>
        <h2 className="text-gradient" style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, maxWidth: '800px', letterSpacing: '-0.02em' }}>
          Your Music.<br/>Your Community.
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
          Discover tracks from underground artists, engage with music reviewers, and build your ultimate high-fidelity library.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/upload" style={{ textDecoration: 'none' }}>
            <button className="btn-accent" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Creator Studio
            </button>
          </Link>
          <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Explore Trending
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '4rem', width: '100%' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--accent)' }}>●</span> Trending Right Now
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
          {trendingTracks.slice(0, 10).map((apiTrack) => {
            const track = {
               id: `itunes-${apiTrack.id}`,
               title: apiTrack.title,
               artist: apiTrack.artist,
               coverUrl: apiTrack.coverUrl,
               audioUrl: apiTrack.previewUrl || '',
               duration: Math.floor((apiTrack.durationMs || 0) / 1000)
            };
            return (
              <div key={track.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={track.coverUrl || 'https://via.placeholder.com/600'} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                  
                  {track.audioUrl && (
                    <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', zIndex: 10 }}>
                      <PlayTrackButton track={track} queue={[track]} />
                    </div>
                  )}
                </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={track.title}>
                  {track.title}
                </h4>
                <Link href={`/artist/${encodeURIComponent(track.artist.replace(/\s+/g, '-').toLowerCase())}`} style={{ textDecoration: 'none' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', transition: 'color var(--transition-fast)' }} title={track.artist}>
                    {track.artist}
                  </p>
                </Link>
              </div>
            </div>
          )})}
        </div>
      </div>
    </main>
  );
}
