<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { SeasonDetails } from '@/types/SeasonDetails';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const apiStore = useApiStore();

const props = defineProps<{ season: SeasonDetails }>();

const season = ref(props.season);

const episodeCount = computed(()=>{
  return apiStore.episodes[season.value.show_title]?.[`Season ${season.value.season_number}`]?.length;
});

//we're getting the episode length and year
//at render-time and missing updates in params
const episode_length = computed(()=>{
  return apiStore.episodes[season.value.show_title]?.[`Season ${season.value.season_number}`]?.[0]?.runtime;
});
const season_year = computed(()=>{
  return apiStore.episodes[season.value.show_title]?.[`Season ${season.value.season_number}`]?.[0]?.season_year;
});


function confirm(){
  const seasonRef = apiStore.getSeasonRef(season.value.show_title,`Season ${season.value.season_number}`);
  if(!seasonRef){
    toast(`Enexpected error: Season ${season.value.season_number} does not exist`,{type:'error',autoClose:3000});
    return;
  }
  const episodes = [...seasonRef];
  apiStore.postEpisodesSequentially(episodes).then((results)=>{
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
  <BModal id="modal-tvSeasonConfirm" @ok="confirm">
    <p>Batch approve all epsidoes in the following set?</p>
    <BListGroup>
      <BListGroupItem>Show: {{season.show_title}}</BListGroupItem>
      <BListGroupItem>Genre: {{season.genre}}</BListGroupItem>
      <BListGroupItem>Season: {{season.season_number}}</BListGroupItem>
      <BListGroupItem>Year: {{season_year}}</BListGroupItem>
      <BListGroupItem>Episode Length: {{episode_length}}</BListGroupItem>
      <BListGroupItem>Episodes: {{episodeCount}}</BListGroupItem>
    </BListGroup>
  </BModal>
</template>
