export interface Episode {
  UID: number | null,
  show_title: string,
  genre: string | null,
  season_number: number | null,
  season_year: number | null,
  ep_number: string | null,
  runtime: number | null,
  ep_title:string | null,
  play_count:number | null,
  rating:number | null,
  file_path: string
  cover_path: string | null
}
