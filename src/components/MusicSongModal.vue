<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { Song } from '@/types/Song';

const props = defineProps<{ song: Song }>();
const song = ref(props.song);
const apiStore = useApiStore();

function update(){
  apiStore.updateSong(song.value);
}

</script>

<template>
  <BModal id="modal-musicSong" title="Details" @ok="update">
    <BContainer>
      <BRow>
        <BCol>
          <BFormGroup label="Title:" label-for="modal-musicSong-title">
            <BFormInput id="modal-musicSong-title" v-model="song.title"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Artist:" label-for="modal-musicSong-artist">
            <BFormInput id="modal-musicSong-artist" v-model="song.artist"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Genre:" label-for="modal-musicSong-genre">
            <BFormInput id="modal-musicSong-genre" v-model="song.genre"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Feat:" label-for="modal-musicSong-feat">
            <BFormInput id="modal-musicSong-feat" v-model="song.feat"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Publisher:" label-for="modal-musicSong-publisher">
            <BFormInput id="modal-musicSong-publisher" v-model="song.publisher"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Year:" label-for="modal-musicSong-year">
            <BFormInput id="modal-musicSong-year" v-model="song.year"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Home City:" label-for="modal-musicSong-artistCountry">
            <BFormInput id="modal-musicSong-artistCountry" v-model="song.artist_country"></BFormInput>
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup label="Album:" label-for="modal-musicSong-album">
            <BFormInput id="modal-musicSong-album" v-model="song.album"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Band:" label-for="modal-musicSong-band">
            <BFormInput id="modal-musicSong-band" v-model="song.band"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Bpm:" label-for="modal-musicSong-bpm">
            <BFormInput id="modal-musicSong-band" v-model="song.bpm"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Length:" label-for="modal-musicSong-length">
            <BFormInput id="modal-musicSong-length" v-model="song.length"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Track Number:" label-for="modal-musicSong-trackNumber">
            <BFormInput id="modal-musicSong-trackNumber" v-model="song.track_number"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Home Country:" label-for="modal-musicSong-artistCountry">
            <BFormInput id="modal-musicSong-artistCountry" v-model="song.artist_country"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Home State/Province:" label-for="modal-musicSong-artistState">
            <BFormInput id="modal-musicSong-artistState" v-model="song.artist_state"></BFormInput>
          </BFormGroup>
        </BCol>
      </BRow>
    </BContainer>
  </BModal>
</template>
