"use client";

import { useState, useRef } from 'react';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setStatus('uploading');
    setProgress(0);
    setErrorMessage(null);
    
    // Simulate upload progress for UX while actual fetch happens
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 15;
      });
    }, 200);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      clearInterval(interval);
      setProgress(100);
      
      if (data.success) {
        setStatus('processing');
        // Simulate Metadata Extraction (e.g., Python AI engine parsing waveforms)
        setTimeout(() => {
          setStatus('success');
          setResultUrl(data.url);
        }, 1500);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Upload failed');
      }
    } catch (err) {
      clearInterval(interval);
      setStatus('error');
      setErrorMessage('Network or Server Error');
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3rem', fontWeight: 800 }}>Creator Studio</h1>
          <button className="btn-secondary" style={{ padding: '0.5rem 1.2rem' }} onClick={() => window.location.href = '/'}>
            Back to Home
          </button>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          Upload your exclusive tracks directly to Radiod. We will automatically extract acoustic metadata for the discovery feed.
        </p>
        
        <div 
          className="glass-panel"
          style={{ 
            padding: '4rem 2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border-subtle)'}`,
            backgroundColor: dragActive ? 'rgba(0, 229, 255, 0.05)' : 'var(--glass-bg)',
            transition: 'all var(--transition-smooth)',
            gap: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '400px'
          }}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {status === 'idle' && (
            <>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', transition: 'var(--transition-fast)', transform: dragActive ? 'scale(1.1)' : 'scale(1)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Drag and drop your audio file</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>WAV, FLAC, or high-quality MP3 (Max 100MB)</p>
              
              <input 
                ref={inputRef}
                type="file" 
                accept="audio/*,image/*" 
                style={{ display: 'none' }}
                onChange={handleChange}
              />
              <button 
                className="btn-accent" 
                style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
                onClick={() => inputRef.current?.click()}
              >
                Browse Files
              </button>
            </>
          )}

          {(status === 'uploading' || status === 'processing') && (
            <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem 0' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid var(--border-subtle)', borderTopColor: status === 'processing' ? 'var(--accent)' : 'var(--primary)', animation: 'spin 1s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', color: status === 'processing' ? 'var(--accent)' : '#fff' }}>
                  {status === 'uploading' ? 'Uploading Track...' : 'Extracting Acoustic Metadata...'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{file?.name}</p>
              </div>
              
              <div style={{ width: '100%', height: '12px', background: 'var(--surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))', transition: 'width 0.3s ease', boxShadow: '0 0 10px var(--accent-glow)' }} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '2rem 0', width: '100%', maxWidth: '500px' }}>
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', boxShadow: '0 0 30px var(--accent-glow)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Upload Complete!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file?.name}</p>
              </div>

               {resultUrl && (
                  <div style={{ width: '100%', padding: '1.5rem', background: 'var(--surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>Preview Upload</p>
                    <audio controls src={resultUrl} style={{ width: '100%' }} />
                  </div>
               )}

              <button className="btn-secondary" style={{ marginTop: '1.5rem', padding: '0.8rem 2rem' }} onClick={() => { setStatus('idle'); setFile(null); setResultUrl(null); }}>
                Upload Another Track
              </button>
            </div>
          )}

          {status === 'error' && (
             <div style={{ textAlign: 'center' }}>
               <h3 style={{ color: 'var(--danger)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>Upload Failed</h3>
               <p style={{ color: 'var(--text-muted)' }}>{errorMessage || 'Something went wrong connecting to the storage service.'}</p>
               <button className="btn-secondary" style={{ marginTop: '2rem' }} onClick={() => setStatus('idle')}>Try Again</button>
             </div>
          )}
        </div>
      </div>

<style dangerouslySetInnerHTML={{__html: `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  audio {
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
  }
  
  /* Next.js doesn't natively allow deep styling of shadow DOM audio controls out of the box without complex hacks,
     but we can do basic CSS filters for dark mode matching! */
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
    </main>
  );
}
