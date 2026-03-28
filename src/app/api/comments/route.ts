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

    const { content, playlistId, songId } = await request.json();

    if (!content || (!playlistId && !songId)) {
      return NextResponse.json({ success: false, error: 'Content and target ID required' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: dbUser.id,
        playlistId: playlistId || null,
        songId: songId || null,
      },
      include: {
        user: { select: { name: true, image: true, email: true } }
      }
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error('Comment Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to post comment' }, { status: 500 });
  }
}
