export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string | null;
  durationMs: number;
}

/**
 * Searches for music using the public iTunes Search API.
 * This provides zero-config access to real album art, artist names, and 30-second playable audio previews!
 */
export async function searchMusic(query: string, limit: number = 20): Promise<Track[]> {
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from iTunes API');
    }
    
    const data = await response.json();
    
    return data.results.map((item: any) => ({
      id: item.trackId.toString(),
      title: item.trackName,
      artist: item.artistName,
      album: item.collectionName,
      // Replace the default 100x100 resolution with a high-quality 600x600 resolution artwork
      coverUrl: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg') : '',
      previewUrl: item.previewUrl || null,
      durationMs: item.trackTimeMillis || 0,
    }));
  } catch (error) {
    console.error('Error fetching music:', error);
    return [];
  }
}

/**
 * Fetches top/trending songs by searching a generic popular term or specific artist for initial catalog population.
 */
export async function getTrendingMusic(): Promise<Track[]> {
  // A curated default query to get standard high-quality pop/hip-hop tracks for the demo feed.
  return searchMusic('billboard hits', 20);
}
