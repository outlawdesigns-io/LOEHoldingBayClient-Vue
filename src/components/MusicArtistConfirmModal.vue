<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { ArtistDetails } from '@/types/ArtistDetails';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const apiStore = useApiStore();

const props = defineProps<{ artist: ArtistDetails }>();

const artist = ref(props.artist);

const songCount = computed(()=>{
  let count = 0;
  const artistRef = apiStore.songData.songs[artist.value.name];
  if(artistRef){
    for(const [albumKey, songs] of Object.entries(artistRef)){
      count += songs.length;
    }
  }
  return count;
});

const albumCount = computed(()=>{
  const artistRef = apiStore.songData.songs[artist.value.name];
  let count = 0;
  if(artistRef){
    let keys = Object.keys(artistRef);
    count = keys.length;
  }
  return count;
});

async function confirm(){
  const allErrors = [];
  const artistRef = apiStore.songData.songs[artist.value.name];
  if(!artistRef){
    toast(`Enexpected error: ${artist.value.name} does not exist`,{type:'error',autoClose:3000});
    return;
  }
  for(let [albumKey, songs] of Object.entries(artistRef)){
    const postCopies = [...songs];
    const results = await apiStore.postSongsSequentially(postCopies);
    allErrors.push(...results.filter(r => r.status == "rejected").map(r => r.reason.message));
  }
  if(allErrors.length){
    toast(allErrors.join("\n"),{type:'error',autoClose:3000});
    return;
  }
  toast(`Approved!`,{type:'success',autoClose:3000});
}

</script>

<template>
  <BModal id="modal-tvShowConfirm" @ok="confirm">
    <p>Batch approve all songs in the following set?</p>
    <BListGroup>
      <BListGroupItem>Artist: {{artist.name}}</BListGroupItem>
      <BListGroupItem>Genre: {{artist.genre}}</BListGroupItem>
      <BListGroupItem>Location: {{artist.homeCity}}, {{artist.homeState}}</BListGroupItem>
      <BListGroupItem>Country: {{artist.homeCountry}}</BListGroupItem>
      <BListGroupItem>Albums: {{albumCount}}</BListGroupItem>
      <BListGroupItem>Songs: {{songCount}}</BListGroupItem>
    </BListGroup>
  </BModal>
</template>
