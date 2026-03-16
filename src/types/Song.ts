export interface Song {
  UID: number
  title: string
  artist: string
  genre: string | null
  feat: string | null
  publisher: string | null
  year: number | null
  artist_country: string | null
  album: string | null
  band: string | null
  bpm: number | null
  length: number | null
  track_number: string | null
  artist_city: string | null
  artist_state: string | null,
  cover_path: string | null,
  file_path: string
}
