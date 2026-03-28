export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const playlist = await prisma.playlist.create({
      data: {
        name: name || 'New Playlist',
        description: description || '',
        userId: dbUser.id,
      }
    });

    return NextResponse.json({ success: true, playlist });
  } catch (error) {
    console.error('Create Playlist Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create playlist' }, { status: 500 });
  }
}
