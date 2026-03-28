export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDistanceToNow } from 'date-fns';

export default async function CommunityPage() {
  // Fetch latest active playlists as "Threads"
  const rawPlaylists = await prisma.playlist.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      _count: {
         select: { comments: true },
      }
    }
  });

  const threads = rawPlaylists.map((pl: any) => ({
    id: pl.id,
    title: pl.name,
    author: pl.user.name || 'Anonymous',
    replies: pl._count.comments,
    tags: ['Community', 'Playlist']
  }));

  // Fetch latest comments as "Friend Activity"
  const rawComments = await prisma.comment.findMany({
    take: 15,
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      song: true,
      playlist: true
    }
  });

  const posts = rawComments.map((c: any) => {
    let targetName = 'Unknown';
    let targetLink = '#';
    
    if (c.song) {
      targetName = c.song.title;
      targetLink = `/discover`;
    } else if (c.playlist) {
      targetName = c.playlist.name;
      targetLink = `/playlist/${c.playlist.id}`;
    }

    return {
      id: c.id,
      user: c.user.name || 'Anonymous',
      avatar: c.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name || 'A')}&background=random`,
      action: 'commented on',
      target: targetName,
      targetLink: targetLink,
      time: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true }),
      likes: Math.floor(Math.random() * 5),
      comments: 0
    };
  });

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '6rem', flexWrap: 'wrap' }}>
       
       <style dangerouslySetInnerHTML={{__html: `
         .thread-row { transition: all var(--transition-fast); }
         .thread-row:hover { background: var(--surface-hover); transform: translateX(8px); border-left: 2px solid var(--accent); }
         .action-btn { transition: color var(--transition-fast); }
         .action-btn:hover { color: var(--primary); }
       `}} />

       {/* Left Column: Discussion Boards */}
       <div style={{ flex: '1 1 600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
             <div>
                <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', lineHeight: 1 }}>Community</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Join the conversation with thousands of music lovers.</p>
             </div>
             <button className="btn-accent" style={{ padding: '0.8rem 2rem', fontSize: '1.05rem', boxShadow: '0 4px 16px var(--accent-glow)' }}>
                + New Thread
             </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {threads.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No community playlists have been created yet.</div>
             ) : threads.map((thread: any) => (
               <Link href={`/playlist/${thread.id}`} key={thread.id} style={{ textDecoration: 'none' }}>
                 <div className="glass-panel thread-row" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderLeft: '2px solid transparent' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{thread.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                         <span>Posted by <span style={{ color: 'var(--accent)', fontWeight: 600 }}>@{thread.author}</span></span>
                         <span style={{ color: 'var(--border-subtle)' }}>|</span>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                           {thread.tags.map((tag: any) => (
                              <span key={tag} style={{ background: 'rgba(255,46,147,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>{tag}</span>
                           ))}
                         </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
                       <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>{thread.replies}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Replies</div>
                    </div>
                 </div>
               </Link>
             ))}
          </div>
          
          <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontWeight: 600 }}>
             Load More Threads
          </button>
       </div>

       {/* Right Column: Friend Activity Feed */}
       <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <span style={{ color: 'var(--primary)' }}>●</span> Friend Activity
          </h2>

          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             {posts.map((post: any) => (
                <div key={post.id} style={{ display: 'flex', gap: '1rem' }}>
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={post.avatar} alt={post.user} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
                   <div>
                      <div style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
                         <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{post.user}</span>{' '}
                         <span style={{ color: 'var(--text-muted)' }}>{post.action}</span>{' '}
                         <Link href={post.targetLink} style={{ textDecoration: 'none' }}>
                            <span style={{ fontWeight: 600, color: 'var(--accent)', cursor: 'pointer' }}>{post.target}</span>
                         </Link>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', marginBottom: '0.8rem' }}>{post.time}</div>
                      
                      {/* Interaction Actions */}
                      <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                         <button className="action-btn" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                           {post.likes}
                         </button>
                         <button className="action-btn" style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                           {post.comments}
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </main>
  );
}
