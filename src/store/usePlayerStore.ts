import { create } from 'zustand';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration?: number;
}

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  
  // Actions
  playTrack: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 80,

  playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  
  setQueue: (tracks) => set({ queue: tracks }),

  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  nextTrack: () => {
    const { queue } = get();
    if (queue.length > 0) {
      const next = queue[0];
      set({ 
        currentTrack: next, 
        queue: queue.slice(1),
        isPlaying: true 
      });
    } else {
      set({ isPlaying: false, currentTrack: null }); // End of queue
    }
  },

  setVolume: (volume) => set({ volume }),
}));
