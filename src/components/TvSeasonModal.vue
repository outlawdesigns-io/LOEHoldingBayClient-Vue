<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { SeasonDetails } from '@/types/SeasonDetails';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const apiStore = useApiStore();

const props = defineProps<{ season: SeasonDetails }>();

const initShow = ref(props.season.show_title);
const initSeasonNum = ref(props.season.season_number);
const season = ref(props.season);
const episodeList = ref<string | null>(null);

function update(){
  try{
    apiStore.updateTvSeason({
      initShow: initShow.value,
      initSeasonNum: initSeasonNum.value,
      show_title: season.value.show_title,
      genre: season.value.genre,
      season_year: season.value.season_year,
      season_number: season.value.season_number,
      episode_length: season.value.episode_length,
      episodeList: episodeList.value?.split("\n") || []
    });
  }catch(err){
    if(err instanceof Error){
      toast(`${err.message}`,{type:'error',autoClose:3000});
    }else{
      toast('An Unexpected error occurred. See console for more details. ',{type:'error',autoClose:3000});
      console.log('An Unexpected error occurred.',err);
    }
  }
}

</script>

<template>
  <BModal id="modal-tvSeason" @ok="update">
    <BFormGroup label="Show:" label-for="modal-tvShow-title">
      <BFormInput id="modal-tvShow-title" v-model="season.show_title"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Genre:" label-for="modal-tvShow-genre">
      <BFormInput id="modal-tvShow-genre" v-model="season.genre"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Year:" label-for="modal-tvShow-year">
      <BFormInput id="modal-tvShow-year" v-model="season.season_year"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Season #:" label-for="modal-tvShow-season_number">
      <BFormInput id="modal-tvShow-season_number" v-model="season.season_number"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Episode Length:" label-for="modal-tvShow-episode_length">
      <BFormInput id="modal-tvShow-episode_length" v-model="season.episode_length"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Episode List:" label-for="modal-tvShow-episodeList">
      <BFormTextarea id="modal-tvShow-episodeList" v-model="episodeList" rows="14" />
    </BFormGroup>
  </BModal>
</template>
