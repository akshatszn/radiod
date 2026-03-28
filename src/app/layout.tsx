import type { Metadata } from 'next';
import './globals.css';
import AudioPlayer from '../components/AudioPlayer';

export const metadata: Metadata = {
  title: 'Project Radiod - The Music Social Network',
  description: 'Unleash the full potential of music discovery, community interaction, and creator economy.',
};

import { Providers } from '../components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: '90px' }}>
        <Providers>
          {children}
          <AudioPlayer />
        </Providers>
      </body>
    </html>
  );
}
