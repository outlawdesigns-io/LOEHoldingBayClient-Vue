<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { AlbumDetails } from '@/types/AlbumDetails';

const apiStore = useApiStore();

const props = defineProps<{ album: AlbumDetails }>();
const album = ref(props.album);
const selectedCover = ref('');

const imageList = computed(()=>{
  return apiStore.songData.possibleCovers;
});

function update(){
  apiStore.updateMusicAlbumCover(
    album.value.artist,
    album.value.album,
    selectedCover.value
  );
}
function select(img: string){
  selectedCover.value = img;
}

</script>

<template>
  <BModal id="modal-musicCovers" title="Possible Covers" @ok="update">
    <div v-for="img in imageList">
      <img :src="img" class="imageContainer" @click="select(img)" :class="selectedCover == img ? 'selectedCover':'' ">
    </div>
  </BModal>
</template>


<style scoped>
.selectedCover{
  border: 2px solid green;
}
</style>
