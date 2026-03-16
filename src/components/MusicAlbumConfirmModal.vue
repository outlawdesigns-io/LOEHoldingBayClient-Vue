<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { AlbumDetails } from '@/types/AlbumDetails';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const apiStore = useApiStore();

const props = defineProps<{ album: AlbumDetails }>();

const album = ref(props.album);

const songCount = computed(()=>{
  let count = 0;
  return apiStore.songData.songs[album.value.artist]?.[album.value.album]?.length;
});

function confirm(){
  const albumRef = apiStore.getAlbumRef(album.value.artist,album.value.album);
  if(!albumRef){
    toast(`Enexpected error: ${album.value.album} does not exist`,{type:'error',autoClose:3000});
    return;
  }
  let songs = [...albumRef];
  apiStore.postSongsSequentially(songs).then((results)=>{
    const errors = results.filter(r => r.status == "rejected").map(r => r.reason.message);
    if(errors.length){
      toast(errors.join("\n"),{type:'error',autoClose:3000});
      return;
    }
    toast(`Approved!`,{type:'success',autoClose:3000});
  });
}

</script>

<template>
  <BModal id="modal-musicAlbumConfirm" @ok="confirm">
    <p>Batch approve all songs in the following set?</p>
    <BListGroup>
      <BListGroupItem>Artist: {{album.artist}}</BListGroupItem>
      <BListGroupItem>Album: {{album.album}}</BListGroupItem>
      <BListGroupItem>Genre: {{album.genre}}</BListGroupItem>
      <BListGroupItem>Year: {{album.year}}</BListGroupItem>
      <BListGroupItem>Publisher: {{album.publisher}}</BListGroupItem>
      <BListGroupItem>Songs: {{songCount}}</BListGroupItem>
    </BListGroup>
  </BModal>
</template>
