<script setup lang="ts">

import { ref } from 'vue';
import { useApiStore } from '@/stores/api';
import type { Movie } from '@/types/Movie';


const props = defineProps<{ movie: Movie }>();
const movie = ref(props.movie);

const apiStore = useApiStore();

</script>

<template>
  <BModal id="modal-movieCover">
    <BRow>
      <BCol>
        <div style="margin:auto">
          <img :src="movie.cover_path" alt="" height="300" width="200">
        </div>
      </BCol>
    </BRow>
    <BRow>
      <BCol>
        <BFormGroup label="Url:" label-for="modal-movieCover-cover_path">
          <BFormInput id="modal-movieCover-cover_path" v-model="movie.cover_path"></BFormInput>
        </BFormGroup>
      </BCol>
    </BRow>
  </BModal>
</template>
