"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <button className="btn-accent" style={{ opacity: 0.5 }}>Loading...</button>;
  }

  if (session && session.user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          {session.user.name || session.user.email}
        </span>
        <button className="btn-secondary" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button className="btn-accent" onClick={() => signIn()}>
      Log In
    </button>
  );
}
