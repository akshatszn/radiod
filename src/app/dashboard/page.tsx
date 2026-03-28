export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import PlayTrackButton from '@/components/PlayTrackButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect('/');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      songs: {
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: { songs: true }
      }
    }
  });

  if (!user) {
    redirect('/');
  }

  const totalBuilds = user._count.songs;
  
  const mappedTracks = user.songs.map((song: any) => ({
    id: song.id,
    title: song.title,
    artist: user.name || 'Unknown Artist',
    coverUrl: song.coverArtUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100&auto=format&fit=crop',
    audioUrl: song.audioUrl,
    duration: song.duration
  }));
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', paddingBottom: '100px' }}>
      {/* Sidebar Navigation */}
      <aside className="glass-panel" style={{ width: '280px', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRadius: 0, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 10 }}>
        <h2 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 800 }}>RADIOD FOR ARTISTS</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ padding: '0.75rem 1rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>Overview Analytics</div>
          <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Audience Demographics</div>
          <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Catalog Releases</div>
          <Link href="/upload" style={{ textDecoration: 'none' }}>
             <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Creator Studio</div>
          </Link>
        </nav>
        
        <div style={{ flex: 1 }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255, 46, 147, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontSize: '1.2rem' }}>A</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Artist Account</div>
            <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600 }}>PRO TIER</div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Workspace */}
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
           <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Welcome back, {user.name || 'Creator'}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Here's what is happening with your music today.</p>
           </div>
           <Link href="/upload"><button className="btn-accent" style={{ padding: '1rem 2rem', fontSize: '1.05rem', boxShadow: '0 4px 20px var(--accent-glow)' }}>Upload New Release</button></Link>
        </div>

        {/* High Level Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
           {[ 
             { label: 'Total Uploads', value: totalBuilds.toString(), trend: 'Active', isUp: true },
             { label: 'Unique Listeners', value: '450K', trend: '+8.2%', isUp: true },
             { label: 'Artist Followers', value: '89K', trend: '+5.4%', isUp: true },
             { label: 'Est. Revenue', value: '$4,120', trend: '-2.1%', isUp: false }
           ].map((stat, i) => (
              <div key={i} className="glass-panel" style={{ padding: '1.5rem', borderTop: stat.isUp ? '2px solid var(--accent)' : '2px solid var(--danger)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 500 }}>{stat.label}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>{stat.value}</div>
                <div style={{ color: stat.isUp ? 'var(--accent)' : 'var(--danger)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  {stat.isUp && stat.trend !== 'Active' ? '↑' : ''} {!stat.isUp && stat.trend !== 'Active' ? '↓' : ''} {stat.trend} {stat.trend !== 'Active' ? 'this week' : ''}
                </div>
              </div>
           ))}
        </div>

        {/* Visualized Charts Area */}
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Catalog</h3>
           </div>
           
           {mappedTracks.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>You haven't uploaded any music yet. <Link href="/upload" style={{ color: 'var(--accent)' }}>Upload your first track</Link>.</div>
           ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {mappedTracks.map((track: any, i: number) => (
                    <div key={track.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                       <div style={{ width: '2rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>{i + 1}</div>
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={track.coverUrl} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover', marginRight: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }} alt="cover" />
                       <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '0.15rem' }}>{track.title}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>Available Worldwide</div>
                       </div>
                       <div style={{ color: 'var(--text-muted)', marginRight: '2rem', fontWeight: 500, fontVariantNumeric: 'tabular-nums', width: '45px', textAlign: 'right' }}>
                         {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                       </div>
                       <PlayTrackButton track={track} queue={mappedTracks} />
                    </div>
                 ))}
              </div>
           )}
        </div>
      </main>
    </div>
  );
}
