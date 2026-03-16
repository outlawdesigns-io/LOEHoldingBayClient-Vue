<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { Episode } from '@/types/Episode';

const props = defineProps<{ episode: Episode }>();
const episode = ref(props.episode);
const apiStore = useApiStore();

function update(){
  apiStore.updateEpisode(episode.value);
}

</script>

<template>
  <BModal id="modal-tvEpisode" title="Details" @ok="update">
    <BContainer>
      <BRow>
        <BCol>
          <BFormGroup label="Show Title:" label-for="modal-tvEpisode-show_title">
            <BFormInput id="modal-tvEpisode-show_title" v-model="episode.show_title"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Ep Number:" label-for="modal-tvEpisode-ep_number">
            <BFormInput id="modal-tvEpisode-ep_number" v-model="episode.ep_number"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Ep Length:" label-for="modal-tvEpisode-runtime">
            <BFormInput id="modal-tvEpisode-runtime" v-model="episode.runtime"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Year:" label-for="modal-tvEpisode-year">
            <BFormInput id="modal-tvEpisode-year" v-model="episode.season_year"></BFormInput>
          </BFormGroup>
        </BCol>
        <BCol>
          <BFormGroup label="Genre:" label-for="modal-tvEpisode-genre">
            <BFormInput id="modal-tvEpisode-genre" v-model="episode.genre"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Ep Title:" label-for="modal-tvEpisode-ep_title">
            <BFormInput id="modal-tvEpisode-ep_title" v-model="episode.ep_title"></BFormInput>
          </BFormGroup>
          <BFormGroup label="Season:" label-for="modal-tvEpisode-season_number">
            <BFormInput id="modal-tvEpisode-season_number" v-model="episode.season_number"></BFormInput>
          </BFormGroup>
        </BCol>
      </BRow>
    </BContainer>
  </BModal>
</template>
