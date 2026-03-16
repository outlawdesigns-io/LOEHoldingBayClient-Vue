<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { ArtistDetails } from '@/types/ArtistDetails';
import type { AlbumDetails } from '@/types/AlbumDetails';
import type { Song } from '@/types/Song';
import type { MusicResults } from '@/types/MusicResults';
import type { Album } from '@/types/Album';
import MusicCoverModal from '../components/MusicCoverModal.vue';
import MusicArtistModal from '../components/MusicArtistModal.vue';
import MusicAlbumModal from '../components/MusicAlbumModal.vue';
import MusicSongModal from '../components/MusicSongModal.vue';
import MusicArtistConfirmModal from '../components/MusicArtistConfirmModal.vue';
import MusicAlbumConfirmModal from '../components/MusicAlbumConfirmModal.vue';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const apiStore = useApiStore();

const selectedCover = ref(null);
const loading = ref(true);
const showArtistModal = ref(false);
const showCoverModal = ref(false);
const showAlbumModal = ref(false);
const showSongModal = ref(false);
const showApproveArtistConfirm = ref(false);
const showApproveAlbumConfirm = ref(false);

const selectedArtist = ref<ArtistDetails | null>(null);
const selectedAlbum = ref<AlbumDetails | null>(null);
const selectedSong = ref<Song | null>(null);

apiStore.ensureInitialized().then(()=>{
  if(Object.keys(apiStore.songData.songs).length === 0){
    triggerStoreUpdate();
    return;
  }
  loading.value = false;
});

const scanResults = computed<MusicResults>(()=>{
  return apiStore.songData.songs;
});

function triggerStoreUpdate(){
  apiStore.getMusic().then(()=>{
    loading.value = false;
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
function getCtrlProperty<k extends keyof Song>(albumsObj: Album,targetProperty: k){
  const [firstKey] = Object.keys(albumsObj);
  const firstSong = firstKey ? albumsObj[firstKey]?.[0] : undefined;
  return firstSong?.[targetProperty] ?? "N/A";
}
function selectAlbum(songs:Song[]){
  if(songs[0]){
    selectedAlbum.value = {
      initArtist: songs[0].artist,
      initAlbum: songs[0].album || 'N/A',
      artist: songs[0].artist,
      album:songs[0].album || 'N/A',
      genre:songs[0]?.genre || null,
      year:songs[0]?.year || null,
      publisher:songs[0]?.publisher || null
    };
  }
}
function selectArtist(albums: any){
  selectedArtist.value = {
    name: getCtrlProperty(albums,'artist'),
    genre: getCtrlProperty(albums,'genre'),
    homeCountry: getCtrlProperty(albums,'artist_country'),
    homeCity: getCtrlProperty(albums,'artist_city'),
    homeState: getCtrlProperty(albums,'artist_state')
  };
}
function parseTrackNumbers(songs: Song[]){
  for(let s of songs){
    if(s.track_number){
      let res = s.track_number.split('/');
      if(res && res[0]){
        s.track_number = String(parseInt(res[0]));
      }else{
        s.track_number = String(parseInt(s.track_number));
      }
    }
  }
}
function parseFeat(songs: Song[]){
  const bracketPattern = /\[(.*?)\]/g;
  const parPattern = /\((.*?)\)/g;
  for(let s of songs){
    let matches = s.title.match(bracketPattern);
    if(matches){
      s.title = s.title.replace(matches[0],'');
    }
    matches = s.title.match(parPattern);
    if(matches){
      let feat = matches[0].replace(")","]");
      feat = feat.replace("(","[");
      s.title = s.title.replace(matches[0],feat);
      s.feat = feat;
    }
  }
}
function triggerArtistUpdateModal(albums: any){
  selectArtist(albums);
  showArtistModal.value = true;
}
function triggerAlbumUpdateModal(songs: Song[]){
  selectAlbum(songs);
  showAlbumModal.value = true;
}
function triggerCoverModal(songs: Song[]){
  selectAlbum(songs);
  showCoverModal.value = true;
}
function triggerSongUpdateModal(song: Song){
  selectedSong.value = song;
  showSongModal.value = true;
}
function triggerArtistApproveModal(albums: any){
  selectArtist(albums);
  showApproveArtistConfirm.value = true;
}
function triggerAlbumApproveModal(songs: Song[]){
  selectAlbum(songs);
  showApproveAlbumConfirm.value = true;
}
function triggerLibraryRescan(){
  loading.value = true;
  triggerStoreUpdate();
}
function deleteArtist(albums: any){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
function deleteAlbum(songs: Song[]){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
function deleteSong(song: Song){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
function approveSong(song: Song){
  //toast("Still testing. Don't actually post!",{type:'error',autoClose:3000});
  //return;
  apiStore.postSong(song).then((song: Song)=>{
    toast(`${song.title} approved!`);
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
</script>

<style scoped>

.artistMisMatch{
  background-color:#ff6a00;
}

</style>


<template>
  <MusicArtistModal v-if="selectedArtist" v-model="showArtistModal" :artist="selectedArtist" :key="selectedArtist.name" @close="showArtistModal = false" />
  <MusicAlbumModal v-if="selectedAlbum" v-model="showAlbumModal" :album="selectedAlbum" :key="selectedAlbum.initArtist + selectedAlbum.initAlbum" @close="showAlbumModal = false" />
  <MusicCoverModal v-if="selectedAlbum" v-model="showCoverModal" :album="selectedAlbum" :key="selectedAlbum.initArtist + selectedAlbum.initAlbum" @close="showCoverModal = false" />
  <MusicSongModal v-if="selectedSong" v-model="showSongModal" :song="selectedSong" :key="selectedSong.UID" @close="showSongModal = false" />
  <MusicArtistConfirmModal v-if="selectedArtist" :artist="selectedArtist" v-model="showApproveArtistConfirm" :key="selectedArtist.name" @close="showApproveArtistConfirm = false" />
  <MusicAlbumConfirmModal v-if="selectedAlbum" :album="selectedAlbum" v-model="showApproveAlbumConfirm" :key="selectedAlbum.initArtist + selectedAlbum.initAlbum" @close="showApproveAlbumConfirm = false" />
  <BContainer>
    <BRow v-if="!loading">
      <BCol class="text-end mb-2">
        <BButton size="sm" variant="info" @click="triggerLibraryRescan()"><IBiArrowClockwise /></BButton>
      </BCol>
    </BRow>
    <BRow>
      <BCol v-if="loading">
        <BSpinner label="loading" class="mx-1" />
      </BCol>
      <BCol v-else>
        <BAccordion>
          <BAccordionItem v-for="(albums, artistLabel) in scanResults" :key="artistLabel">
            <template #title>
              <div class="d-flex justify-content-between align-items-center w-100">
                <div>
                  <strong>{{artistLabel}}</strong>
                  <span class="ms-2">{{getCtrlProperty(albums,'genre')}}</span>
                </div>
                <BButtonGroup class="mx-3" size="sm">
                  <BButton variant="success" @click.stop="triggerArtistApproveModal(albums)">+</BButton>
                  <BButton variant="info" @click.stop="triggerArtistUpdateModal(albums)">~</BButton>
                  <BButton variant="info" :href="'https://www.metal-archives.com/search?searchString=' + artistLabel + '&type=band_name'" target="_blank">MA</BButton>
                  <BButton variant="info" :href="'https://en.wikipedia.org/w/index.php?go=Go&search=' + artistLabel">WIKI</BButton>
                  <BButton variant="danger" @click.stop="deleteArtist(albums)">x</BButton>
                </BButtonGroup>
              </div>
            </template>
            <BAccordion>
              <BAccordionItem v-for="(songs, albumLabel) in albums" :key="albumLabel">
                <template #title>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <strong>{{albumLabel}}</strong>
                      <span class="ms-2" v-if="songs[0]">({{songs[0].year}})</span>
                    </div>
                    <BButtonGroup class="mx-3" size="sm">
                      <BButton variant="warning" @click.stop="parseTrackNumbers(songs)">#</BButton>
                      <BButton variant="warning" @click.stop="triggerCoverModal(songs)">C</BButton>
                      <BButton variant="warning" @click.stop="parseFeat(songs)">P</BButton>
                      <BButton variant="success" @click.stop="triggerAlbumApproveModal(songs)">+</BButton>
                      <BButton variant="info" @click.stop="triggerAlbumUpdateModal(songs)">~</BButton>
                      <BButton variant="info" :href="'https://www.metal-archives.com/search?searchString=' + albumLabel + '&type=album_title'" target="_blank">MA</BButton>
                      <BButton variant="info" :href="'https://en.wikipedia.org/w/index.php?go=Go&search=' + albumLabel" target="_blank">WIKI</BButton>
                      <BButton variant="danger" @clic.stop="deleteAlbum(songs)">x</BButton>
                    </BButtonGroup>
                  </div>
                </template>
                <BListGroup>
                  <BListGroupItem v-for="song in songs">
                    <div class="d-flex justify-content-between align-items-center w-100">
                      <div :class="song.artist == artistLabel ? '':'artistMisMatch'">
                        <strong class="me-2">{{song.track_number}}</strong>
                        <strong>{{song.title}}</strong>
                      </div>
                      <BButtonGroup size="sm">
                        <BButton variant="success" @click.stop="approveSong(song)">+</BButton>
                        <BButton variant="info" @click.stop="triggerSongUpdateModal(song)">~</BButton>
                        <BButton variant="danger" @click.stop="deleteSong(song)">x</BButton>
                      </BButtonGroup>
                    </div>
                  </BListGroupItem>
                </BListGroup>
              </BAccordionItem>
            </BAccordion>
          </BAccordionItem>
        </BAccordion>
      </BCol>
    </BRow>
  </BContainer>
</template>
