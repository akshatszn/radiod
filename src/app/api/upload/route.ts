export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized: You must be logged in to upload.' }, { status: 401 });
    }

    // Get the user from db to get their ID, since NextAuth sometimes only puts email in session
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User record not found' }, { status: 404 });
    }

    if (!dbUser.isCreator) {
      return NextResponse.json({ success: false, error: 'Forbidden: Only Creator accounts can upload music' }, { status: 403 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const title = (data.get('title') as string) || file?.name?.replace(/\.[^/.]+$/, "") || 'Untitled Track';
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure public/uploads exists to store the files accessible from the web
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e: any) {
      if (e.code !== 'EEXIST') throw e;
    }

    // Generate unique filename to avoid collisions and sanitize
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, ''); 
    const finalName = `${uniqueSuffix}-${filename}`;
    
    const filePath = path.join(uploadDir, finalName);
    
    // Save the file
    await writeFile(filePath, buffer);
    
    // Return relative URL for client usage (audio playback / avatar display)
    const url = `/uploads/${finalName}`;
    
    // Save to Prisma
    const song = await prisma.song.create({
      data: {
        title: title,
        artistId: dbUser.id,
        audioUrl: url,
        // Since we aren't handling cover art in this MVP step, we'll leave it null or use a default
        coverArtUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop'
      }
    });

    return NextResponse.json({ success: true, url, songId: song.id, title: song.title });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Upload process failed' }, { status: 500 });
  }
}
