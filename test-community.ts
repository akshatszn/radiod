import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'error'] });

async function main() {
  console.log('Connecting to Prisma...');
  try {
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
    console.log('Playlists:', rawPlaylists);

    const rawComments = await prisma.comment.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        song: true,
        playlist: true
      }
    });
    console.log('Comments:', rawComments);
  } catch (error) {
    console.error('Test Failed exactly here:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
