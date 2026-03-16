import type { Episode } from '../types/Episode';

export type TvResults = Record<
  string,
  Record<
    string,
    Episode[]
  >
>
