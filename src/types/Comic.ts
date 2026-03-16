export interface Comic {
  UID: number,
  issue_number:number,
  issue_title:string,
  issue_cover_date:string,
  series_title:string,
  series_start_year:number,
  series_end_year:number,
  publisher:string,
  story_arc:string,
  issue_description:string,
  series_description:string,
  issue_type:string,
  reading_order_pos:number,
  file_path: string
}
