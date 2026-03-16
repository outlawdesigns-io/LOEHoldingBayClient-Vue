<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { ArtistDetails } from '@/types/ArtistDetails';

const apiStore = useApiStore();

const props = defineProps<{ artist: ArtistDetails }>();

const initValue = ref(props.artist.name);
const artist = ref(props.artist);

function update(){
  apiStore.updateMusicArtist({
    initValue: initValue.value,
    artist: artist.value.name,
    genre: artist.value.genre,
    homeCountry: artist.value.homeCountry,
    homeCity: artist.value.homeCity,
    homeState: artist.value.homeState
  });
}

</script>

<template>
  <BModal id="modal-musicArtist" @ok="update">
    <BFormGroup label="Artist:" label-for="modal-musicArtist-artist">
      <BFormInput id="modal-musicArtist-artist" v-model="artist.name"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Genre:" label-for="modal-musicArtist-genre">
      <BFormInput id="modal-musicArtist-genre" v-model="artist.genre"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Country:" label-for="modal-musicArtist-homeCountry">
      <BFormInput id="modal-musicArtist-homeCountry" v-model="artist.homeCountry"></BFormInput>
    </BFormGroup>
    <BFormGroup label="City:" label-for="modal-musicArtist-homeCity">
      <BFormInput id="modal-musicArtist-homeCity" v-model="artist.homeCity"></BFormInput>
    </BFormGroup>
    <BFormGroup label="State/Province:" label-for="modal-musicArtist-homeState">
      <BFormInput id="modal-musicArtist-homeState" v-model="artist.homeState"></BFormInput>
    </BFormGroup>
  </BModal>
</template>
