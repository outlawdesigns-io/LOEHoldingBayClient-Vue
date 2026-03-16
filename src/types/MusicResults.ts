import type { Song } from '../types/Song';

export type MusicResults = Record<
  string,
  Record<
    string,
    Song[]
  >
>
