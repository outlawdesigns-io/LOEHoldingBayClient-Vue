<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { ShowDetails } from '@/types/ShowDetails';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const apiStore = useApiStore();

const props = defineProps<{ show: ShowDetails }>();

const show = ref(props.show);

const episodeCount = computed(()=>{
  let count = 0;
  const showRef = apiStore.episodes[show.value.title];
  if(showRef){
    for(const [seasonKey, episodes] of Object.entries(showRef)){
      count += episodes.length;
    }
  }
  return count;
});

const seasonCount = computed(()=>{
  const showRef = apiStore.episodes[show.value.title];
  let count = 0;
  if(showRef){
    let keys = Object.keys(showRef);
    count = keys.length;
  }
  return count;
});

async function confirm(){
  const allErrors = [];
  const showRef = apiStore.episodes[show.value.title];
  if(!showRef){
    toast(`Enexpected error: ${show.value.title} does not exist`,{type:'error',autoClose:3000});
    return;
  }
  for(let [seasonKey, episodes] of Object.entries(showRef)){
    const postCopies = [...episodes];
    const results = await apiStore.postEpisodesSequentially(postCopies);
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
    <p>Batch approve all epsidoes in the following set?</p>
    <BListGroup>
      <BListGroupItem>Show: {{show.title}}</BListGroupItem>
      <BListGroupItem>Genre: {{show.genre}}</BListGroupItem>
      <BListGroupItem>Seasons: {{seasonCount}}</BListGroupItem>
      <BListGroupItem>Episodes: {{episodeCount}}</BListGroupItem>
    </BListGroup>
  </BModal>
</template>
