import { getConfig } from '../runtime-config';
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import loeClient from '@outlawdesigns/loe-rest-client'

import type { OauthTokenResponse } from '@/types/OauthTokenResponse';
import type { MusicResults } from '@/types/MusicResults';
import type { TvResults } from '@/types/TvResults';
import type { Movie } from '../types/Movie';
import type { Song } from '../types/Song';
import type { Episode } from '../types/Episode';
import type { Comic } from '../types/Comic';
import type { AlbumDetails } from '../types/AlbumDetails';
import type { SeasonDetails } from '../types/SeasonDetails';

/*
you'd be better served with
a store for each model, but I haven't
thought about how you'd handle loeClient initialization
*/

/*
figure out how best to abstract songData fsPattern,domain into config
*/

export const useApiStore = defineStore('api',{
  state: ()=> ({
    AUTH_DISCOVERY_URI:'',
    AUTH_CLIENT_ID:'',
    AUTH_REDIRECT_URL:'',
    AUTH_LOGOUT_URL:'',
    AUTH_SCOPE:'',
    API_URL:'',
    isInitialized:false,
    songData:{
      fsPattern: /\/LOE\//,
      fsReplacement: '/LOE/',
      domain:'',
      domainPattern: /.*/,
      songs:{} as MusicResults,
      possibleCovers:[] as string[]
    },
    episodes:{} as TvResults,
    movies:[] as Movie[],
    comics:[] as Comic[]
  }),
  getters: {},
  actions: {
    async ensureInitialized(){
      if(this.isInitialized) return;
      await this.initApiClient();
      this.isInitialized = true;
    },
    async initApiClient(){
      this.AUTH_DISCOVERY_URI = getConfig().AUTH_DISCOVERY_URI;
      this.AUTH_CLIENT_ID = getConfig().AUTH_CLIENT_ID;
      this.AUTH_REDIRECT_URL = getConfig().AUTH_REDIRECT_URL;
      this.AUTH_LOGOUT_URL = getConfig().AUTH_LOGOUT_URL;
      this.AUTH_SCOPE = getConfig().AUTH_SCOPE;
      this.API_URL = getConfig().API_URL;
      this.songData.domain = getConfig().LOE_BASE_URL;
      this.songData.domainPattern = new RegExp(this.songData.domain);
      loeClient.init(this.API_URL,this.AUTH_SCOPE);
      await loeClient.get().auth.init(this.AUTH_DISCOVERY_URI,this.AUTH_CLIENT_ID);
      loeClient.get().onRefresh((tokenSet:OauthTokenResponse)=>{
        localStorage.setItem('oathTokenSet',JSON.stringify(tokenSet));
      });
    },
    async verifyToken(){
      const tokenSet = localStorage.getItem('oathTokenSet');
      if(!tokenSet){
        const challengeResults = await loeClient.get().auth.authorizationCodeFlow(this.AUTH_REDIRECT_URL,this.AUTH_SCOPE,[this.API_URL]);
        const verifier = challengeResults.codeVerifier;
        const state = challengeResults.state;
        sessionStorage.setItem('oauthCodeVerifier',verifier);
        sessionStorage.setItem('oauthState',state);
        window.location.href = challengeResults.redirectUri;
        return;
      }
      loeClient.get().auth.setTokenSet(JSON.parse(tokenSet));
    },
    async swapAuthorizationToken(authorizationCode: string){
      const state = sessionStorage.getItem('oauthState');
      const verifier = sessionStorage.getItem('oauthCodeVerifier');
      let url = new URL(window.location.href);
      if(!url.pathname.endsWith('/')){
        url.pathname += '/';
      }
      await loeClient.get().auth.completeAuthFlow(url,state,verifier);
    },
    async getMusic(){
      this.songData.songs = {};
      this.songData.possibleCovers = [];
      let apiResults = await loeClient.get().holdingBay.getSongs();
      let possibleCovers: string[] = apiResults.images || [];
      this.songData.possibleCovers = possibleCovers.map(e => e.replace(this.songData.fsPattern,this.songData.domain));
      delete apiResults.images;
      this.songData.songs = apiResults;
    },
    getSeasonRef(show: string, season: string):Episode[] | undefined{
      return this.episodes[show]?.[season];
    },
    getAlbumRef(artist: string, album: string):Song[] | undefined{
      return this.songData.songs[artist]?.[album];
    },
    shiftMusicArtist(oldKey: string,newKey: string){
      const oldArtist = this.songData.songs[oldKey];
      if(!oldArtist){
        throw new Error(`${oldArtist} does not exist`);
      }
      if(!this.songData.songs[newKey]){
        this.songData.songs[newKey] = oldArtist;
      }else{
        const newArtist = this.songData.songs[newKey];
        for(const [albumKey, songs] of Object.entries(oldArtist)){
          newArtist[albumKey] = songs;
        }
      }
      delete this.songData.songs[oldKey];
    },
    shiftMusicAlbum(parentKey: string,oldKey: string,newKey: string){
      const parent = this.songData.songs[parentKey];
      if(!parent){
        throw new Error(`${parentKey} does not exist`);
      }
      const album = this.getAlbumRef(parentKey,oldKey);
      if(!album){
        throw new Error(`${oldKey} does not exist in ${parentKey}`);
      }
      if(parent[newKey]){
        throw new Error(`${newKey} already exists in object ${parentKey}`);
      }
      parent[newKey] = album;
      delete parent[oldKey];
    },
    shiftTvShow(oldKey: string,newKey: string){
      const oldShow = this.episodes[oldKey];
      if (!oldShow) throw new Error(`${oldKey} does not exist`);
      if(!this.episodes[newKey]){
        this.episodes[newKey] = oldShow;
      }else{
        const newShow = this.episodes[newKey];
        for(const [seasonKey, episodes] of Object.entries(oldShow)){
          newShow[seasonKey] = episodes;
        }
      }
      delete this.episodes[oldKey];
    },
    shiftTvSeason(parentKey: string,oldKey: string,newKey: string){
      const parent = this.episodes[parentKey]
      if(!parent){
        throw new Error(`${parentKey} does not exist`);
      }
      const season = this.getSeasonRef(parentKey,oldKey);
      if(!season){
        throw new Error(`${oldKey} does not exist in ${parentKey}`);
      }
      if(parent[newKey]){
        throw new Error(`${newKey} already exists in object ${parentKey}`);
      }
      parent[newKey] = season;
      delete parent[oldKey];
    },
    updateMusicArtist(payload: any){
      //payload contains: {initValue (the original value of artist) + <ArtistDetails> }
      for(let albumKey in this.songData.songs[payload.initValue]){
        const albumRef = this.getAlbumRef(payload.initValue, albumKey);
        if(albumRef){
          albumRef.forEach((s)=>{
            s.artist = payload.artist;
            s.band = payload.artist;
            s.genre = payload.genre;
            s.artist_city = payload.homeCity;
            s.artist_state = payload.homeState;
            s.artist_country = payload.homeCountry;
          });
        }
      }
      if(payload.initValue !== payload.artist){
        this.shiftMusicArtist(payload.initValue,payload.artist);
      }
    },
    updateMusicAlbum(payload: any){
      //payload contains: {initArtist (the original value of artist), initAlbum (the original value of album) + <AlbumDetails> }
      let targetParentKey = payload.initArtist;
      let targetChildKey = payload.initAlbum;
      const albumRef = this.getAlbumRef(targetParentKey,targetChildKey);
      if(albumRef){
        albumRef.forEach((s)=>{
          s.artist = payload.artist;
          s.band = payload.artist;
          s.album = payload.album;
          s.genre = payload.genre;
          s.year = payload.year;
          s.publisher = payload.publisher;
        });
      }
      if(payload.album !== payload.initAlbum){
        this.shiftMusicAlbum(payload.initArtist,payload.initAlbum,payload.album);
      }
      if(payload.artist !== payload.initArtist){
        this.shiftMusicArtist(payload.initArtist,payload.artist);
      }
    },
    updateMusicAlbumCover(artistKey: string, albumKey:string, cover_path:string){
      cover_path = cover_path.replace(this.songData.domainPattern,this.songData.fsReplacement);
      const albumRef = this.getAlbumRef(artistKey,albumKey);
      if(albumRef){
        albumRef.forEach((s)=>{
          s.cover_path = cover_path;
        });
      }
    },
    updateSong(song: Song){
      let targetId = song.UID;
      for(let artist in this.songData.songs){
        for(let album in this.songData.songs[artist]){
          const albumRef = this.getAlbumRef(artist,album);
          if(!albumRef) continue;
          const index = albumRef.findIndex(e => e.UID === targetId);
          if(index !== -1){
            const existing = albumRef[index];
            if(existing){
              Object.assign(existing,song);
            }
          }
        }
      }
    },
    updateEpisode(episode: Episode){
      const targetId = episode.UID;
      for (const show in this.episodes){
        for (const season in this.episodes[show]){
          const seasonRef = this.getSeasonRef(show, season);
          if (!seasonRef) continue;
          const index = seasonRef.findIndex(e => e.UID === targetId);
          if (index !== -1){
            const existing = seasonRef[index];
            if(existing){
              Object.assign(existing, episode);
            }
          }
        }
      }
    },
    updateTvSeason(seasonDetails: any){
      let targetParentKey = seasonDetails.initShow;
      let targetChildKey = `Season ${seasonDetails.initSeasonNum}`;
      let titles = seasonDetails.episodeList;
      if(titles.length && titles.length !== this.episodes[targetParentKey]?.[targetChildKey]?.length){
        throw new Error('Title/Episode counts do not match.');
      }
      const seasonRef = this.getSeasonRef(targetParentKey,targetChildKey);
      if(seasonRef){
        seasonRef.forEach((e: Episode, index: number)=>{
          e.show_title = seasonDetails.show_title;
          e.genre = seasonDetails.genre;
          e.season_year = seasonDetails.season_year;
          e.season_number = seasonDetails.season_number;
          e.runtime = seasonDetails.episode_length;

          if(titles.length){
            let s_num = seasonDetails.season_number;
            let e_num = index + 1;
            let ep_num = `S${s_num <= 9 ? "0" + s_num:s_num}E${e_num <= 9 ? "0" + e_num:e_num }`;
            e.ep_title = titles[index];
            e.ep_number = ep_num;
          }
        });
      }
      if(seasonDetails.season_number !== seasonDetails.initSeasonNum){
        this.shiftTvSeason(targetParentKey,targetChildKey,`Season ${seasonDetails.season_number}`);
      }
      if(seasonDetails.show_title !== targetParentKey){
        this.shiftTvShow(targetParentKey,seasonDetails.show_title);
      }
    },
    updateTvShow(showDetails: any){
      for(let seasonKey in this.episodes[showDetails.initValue]){
        const seasonRef = this.getSeasonRef(showDetails.initValue,seasonKey);
        if(seasonRef){
          seasonRef.forEach((e: Episode)=>{
            e.show_title = showDetails.title;
            e.genre = showDetails.genre;
          });
        }
      }
      if(showDetails.initValue !== showDetails.title){
        this.shiftTvShow(showDetails.initValue,showDetails.title);
      }
    },
    async postSong(song: Song){
      let rUID = song.UID;
      let response = await loeClient.get().songs.create(song);
      if(response['error']){
        throw new Error(response['error']);
      }
      for(const parentKey in this.songData.songs){
        const parent = this.songData.songs[parentKey];
        for(const childKey in parent){
          const album = parent[childKey];
          if (!album) throw new Error(`Unexpected error. ${parentKey}[${childKey}] unreachable.`);
          const rIndex = album.findIndex(e => e.UID == rUID);
          if(rIndex !== -1){
            album.splice(rIndex,1);
            if(album.length === 0) delete parent[childKey];
            if(Object.keys(parent).length === 0) delete this.songData.songs[parentKey];
          }
        }
      }
      return response;
    },
    async postSongsSequentially(songs: Song[]): Promise<PromiseSettledResult<Response>[]>{
      const results: PromiseSettledResult<Response>[] = [];
      for(const s of songs){
        try{
          const res = await this.postSong(s);
          results.push({status: "fulfilled", value:res});
        }catch(err){
          results.push({status: "rejected", reason: err});
        }
      }
      return results;
    },
    async postEpisode(episode: Episode){
      let rUID = episode.UID;
      let response = await loeClient.get().episodes.create(episode);
      if(response['error']){
        throw new Error(response['error']);
      }
      for(const showKey in this.episodes){
        const show = this.episodes[showKey];
        for(const seasonKey in show){
          const season = show[seasonKey];
          if (!season) throw new Error(`Unexpected error. ${showKey}[${seasonKey}] unreachable.`);
          const rIndex = season.findIndex(e => e.UID == rUID);
          if(rIndex !== -1){
            season.splice(rIndex,1);
            if(season.length === 0) delete show[seasonKey];
            if(Object.keys(show).length === 0) delete this.episodes[showKey];
          }
        }
      }
      return response;
    },
    async postEpisodesSequentially(episodes: Episode[]): Promise<PromiseSettledResult<Response>[]>{
      const results: PromiseSettledResult<Response>[] = [];
      for(const e of episodes){
        try{
          const res = await this.postEpisode(e);
          results.push({status: "fulfilled", value: res});
        }catch(err){
          results.push({status: "rejected", reason: err});
        }
      }
      return results;
    },
    async getMovies(){
      this.movies = await loeClient.get().holdingBay.getMovies();
    },
    async getComics(){
      this.comics = await loeClient.get().holdingBay.getComics();
    },
    async postMovie(movie: Movie){
      let targetIndex = this.movies.findIndex(e => e.file_path == movie.file_path);
      let response = await loeClient.get().movies.create(movie);
      this.movies.splice(targetIndex,1);
      return response;
    },
    async postComic(comic: Comic){
      let targetIndex = this.comics.findIndex(e => e.UID == comic.UID);
      let response = await loeClient.get().comics.create(comic);
      this.comics.splice(targetIndex,1);
      return response;
    },
    async getEpisodes(){
      this.episodes = await loeClient.get().holdingBay.getTv();
    }
  }
})
