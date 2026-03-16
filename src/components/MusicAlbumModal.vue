<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { AlbumDetails } from '@/types/AlbumDetails';

const props = defineProps<{ album: AlbumDetails }>();

const initArtist = ref(props.album.artist);
const initAlbum = ref(props.album.album);
const album = ref(props.album);

const apiStore = useApiStore();

function update(){
  apiStore.updateMusicAlbum({
    initArtist: initArtist.value,
    initAlbum: initAlbum.value,
    artist: album.value.artist,
    album: album.value.album,
    genre: album.value.genre,
    year: album.value.year,
    publisher: album.value.publisher
  });
}

</script>

<template>
  <BModal id="modal-musicAlbum" @ok="update">
    <BFormGroup label="Artist:" label-for="modal-musicAlbum-artist">
      <BFormInput id="modal-musicAlbum-artist" v-model="album.artist"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Genre:" label-for="modal-musicAlbum-genre">
      <BFormInput id="modal-musicAlbum-genre" v-model="album.genre"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Year:" label-for="modal-musicAlbum-year">
      <BFormInput id="modal-musicAlbum-year" v-model="album.year"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Album:" label-for="modal-musicAlbum-album">
      <BFormInput id="modal-musicAlbum-album" v-model="album.album"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Publisher:" label-for="modal-musicAlbum-publisher">
      <BFormInput id="modal-musicAlbum-publisher" v-model="album.publisher"></BFormInput>
    </BFormGroup>
  </BModal>
</template>
