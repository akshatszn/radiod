import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export const runtime = 'nodejs';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CreatePlaylistButton from '@/components/CreatePlaylistButton';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect('/');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      playlists: {
        include: {
          _count: {
            select: { songs: true }
          }
        }
      }
    }
  });

  if (!dbUser) redirect('/');

  const playlists = dbUser.playlists;

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
       <style dangerouslySetInnerHTML={{__html: `
         .playlist-card { transition: transform var(--transition-fast); }
         .playlist-card:hover { transform: translateY(-4px); }
       `}} />
       
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>Your Library</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>All your favorite tracks, created playlists, and saved albums.</p>
          </div>
          <CreatePlaylistButton />
       </div>

       <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
         <span style={{ color: 'var(--primary)' }}>●</span> Your Playlists
       </h2>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {playlists.map((pl: any) => (
            <Link href={`/playlist/${pl.id}`} key={pl.id} style={{ textDecoration: 'none' }}>
              <div className="glass-panel playlist-card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
                <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pl.coverArtUrl || 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=400&q=80'} alt={pl.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>{pl.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{pl._count.songs} tracks</p>
              </div>
            </Link>
          ))}
       </div>
    </main>
  );
}
