"use client";

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

type CommentType = {
  id: string;
  content: string;
  createdAt: Date | string;
  user: {
    name: string | null;
    image: string | null;
    email: string;
  };
};

export default function CommentSection({ 
  initialComments, 
  playlistId 
}: { 
  initialComments: CommentType[], 
  playlistId: string 
}) {
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, playlistId }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '3rem' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--primary)' }}>●</span> {comments.length} Comments
      </h3>
       
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
           ?
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Add a public comment..." 
            style={{ width: '100%', padding: '1rem 1.5rem', background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-full)', color: 'var(--text-main)', fontSize: '1rem', outline: 'none', transition: 'border var(--transition-fast)' }} 
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'} 
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'} 
          />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="btn-accent" 
            style={{ position: 'absolute', right: '0.4rem', top: '0.4rem', bottom: '0.4rem', padding: '0 1.5rem', borderRadius: 'var(--radius-full)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '...' : 'Post'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
            <img 
               src={comment.user.image || `https://ui-avatars.com/api/?name=${comment.user.name || comment.user.email}&background=random`} 
               alt="avatar" 
               style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} 
            />
            <div>
              <div style={{ marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', marginRight: '0.75rem' }}>
                  {comment.user.name || comment.user.email?.split('@')[0]}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
