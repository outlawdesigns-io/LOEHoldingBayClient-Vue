<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { Comic } from '@/types/Comic';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const apiStore = useApiStore();
const loading = ref(true);
const showCoverModal = ref(false);
const selectedComic = ref<Comic | null>(null);

const comics = computed(()=>{
  return apiStore.comics;
});

apiStore.ensureInitialized().then(()=>{
  if(apiStore.comics.length === 0){
    triggerStoreUpdate();
    return;
  }
  loading.value = false;
});

function buildPreviewUrl(file_path: string){
  return file_path.replace(apiStore.songData.fsPattern,apiStore.songData.domain)
}
function triggerStoreUpdate(){
  apiStore.getComics().then(()=>{
    loading.value = false;
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
function triggerLibraryRescan(){
  loading.value = true;
  triggerStoreUpdate();
}
function approveComic(comic: Comic){
  apiStore.postComic(comic).then((newComic)=>{
    toast(`${comic.issue_title} approved!`);
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
function deleteComic(comic: Comic){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
</script>

<template>
  <BContainer>
    <BRow v-if="!loading">
      <BCol class="text-end mb-2">
        <BButton size="sm" variant="info" @click="triggerLibraryRescan()"><IBiArrowClockwise /></BButton>
      </BCol>
    </BRow>
    <BRow>
      <BCol v-if="loading">
        <BSpinner label="loading" class="mx-1" />
      </BCol>
      <BCol v-else>
        <BAccordion v-for="comic in comics">
          <BAccordionItem>
            <template #title>
              <div class="d-flex justify-content-between align-items-center w-100">
                <div>
                  <strong>{{comic.series_title}} {{comic.issue_number}}</strong>
                </div>
                <BButtonGroup class="mx-3" size="sm">
                  <BButton variant="info" :href="`https://comicvine.gamespot.com/search/?i=&q=${comic.series_title.replace(' ','+')}`" target="_blank">CV</BButton>
                  <BButton variant="info" :href="buildPreviewUrl(comic.file_path)" target="_blank">></BButton>
                  <BButton variant="success" @click.stop="approveComic(comic)">+</BButton>
                  <BButton variant="danger" @click.stop="deleteComic(comic)">x</BButton>
                </BButtonGroup>
              </div>
            </template>
            <BRow>
              <BCol>
                <BFormGroup label="Series Title:" label-for="comic-series_title">
                  <BFormInput id="comic-series_title" v-model="comic.series_title"></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Issue Title:" label-for="comic-issue_title">
                  <BFormInput id="comic-issue_title" v-model="comic.issue_title"></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Issue Number:" label-for="comic-issue_number">
                  <BFormInput id="comic-issue_number" v-model="comic.issue_number"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Cover Date:" label-for="comic-issue_cover_date">
                  <BFormInput id="comic-issue_cover_date" v-model="comic.issue_cover_date" type="date"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Series Start Year:" label-for="comic-series_start_year">
                  <BFormInput id="comic-series_start_year" v-model="comic.series_start_year"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Series End Year:" label-for="comic-series_end_year">
                  <BFormInput id="comic-series_end_year" v-model="comic.series_end_year"></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Publisher:" label-for="comic-publisher">
                  <BFormInput id="comic-publisher" v-model="comic.publisher"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Story Arc:" label-for="comic-story_arc">
                  <BFormInput id="comic-story_arc" v-model="comic.story_arc"></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Issue Description:" label-for="comic-issue_description">
                  <BFormTextarea id="comic-issue_description" v-model="comic.issue_description" rows="4" />
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Series Description:" label-for="comic-series_description">
                  <BFormTextarea id="comic-series_description" v-model="comic.series_description" rows="4" />
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Full File Path:" label-for="comic-file_path">
                  <BFormInput id="comic-file_path" v-model="comic.file_path" disabled></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
          </BAccordionItem>
        </BAccordion>
      </BCol>
    </BRow>
  </BContainer>
</template>
