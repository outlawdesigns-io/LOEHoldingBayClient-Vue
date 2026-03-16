<script setup lang="ts">

import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { ShowDetails } from '@/types/ShowDetails';

const apiStore = useApiStore();

const props = defineProps<{ show: ShowDetails }>();

const initValue = ref(props.show.title);
const show = ref(props.show);

function update(){
  apiStore.updateTvShow({
    initValue: initValue.value,
    title: show.value.title,
    genre: show.value.genre,
  });
}

</script>

<template>
  <BModal id="modal-tvShow" @ok="update">
    <BFormGroup label="Show:" label-for="modal-tvShow-title">
      <BFormInput id="modal-tvShow-title" v-model="show.title"></BFormInput>
    </BFormGroup>
    <BFormGroup label="Genre:" label-for="modal-tvShow-genre">
      <BFormInput id="modal-tvShow-genre" v-model="show.genre"></BFormInput>
    </BFormGroup>
  </BModal>
</template>
