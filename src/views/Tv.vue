<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { Episode } from '@/types/Episode';
import type { ShowDetails } from '@/types/ShowDetails';
import type { SeasonDetails } from '@/types/SeasonDetails';
import type { TvResults } from '@/types/TvResults';
import type { Season } from '@/types/Season';
import TvSeasonModal from '../components/TvSeasonModal.vue';
import TvShowModal from '../components/TvShowModal.vue';
import TVEpisodeModal from '../components/TvEpisodeModal.vue';
import TvShowConfirmModal from '../components/TvShowConfirmModal.vue';
import TvSeasonConfirmModal from '../components/TvSeasonConfirmModal.vue';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const apiStore = useApiStore();

const loading = ref(true);
const showShowModal = ref(false);
const showSeasonModal = ref(false);
const showEpisodeModal = ref(false);
const showApproveShowConfirm = ref(false);
const showApproveSeasonConfirm = ref(false);

const selectedShow = ref<ShowDetails | null>(null);
const selectedSeason = ref<SeasonDetails | null>(null);
const selectedEpisode = ref<Episode | null>(null);

apiStore.ensureInitialized().then(()=>{
  if(Object.keys(apiStore.episodes).length === 0){
    triggerStoreUpdate();
    return;
  }
  loading.value = false;
});

const scanResults = computed<TvResults>(()=>{
  return apiStore.episodes;
});


function triggerStoreUpdate(){
  apiStore.getEpisodes().then(()=>{
    loading.value = false;
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
function getCtrlProperty<k extends keyof Episode>(seasonsObj: Season,targetProperty: k){
  const [firstKey] = Object.keys(seasonsObj);
  const firstEpisode = firstKey ? seasonsObj[firstKey]?.[0] : undefined;
  return firstEpisode?.[targetProperty] ?? "N/A";
}
function selectSeason(episodes: Episode[]){
  console.log(episodes);
  if(episodes[0]){
    selectedSeason.value = {
      show_title: episodes[0].show_title,
      genre: episodes[0]?.genre || null,
      season_year: episodes[0]?.season_year || null,
      season_number: episodes[0]?.season_number || null,
      episode_length: episodes[0]?.runtime || null,
      episode_title_list:[]
    };
  }
}
function selectShow(seasons: any){
  selectedShow.value = {
    title: getCtrlProperty(seasons,'show_title'),
    genre: getCtrlProperty(seasons,'genre')
  };
}
function triggerLibraryRescan(){
  loading.value = true;
  triggerStoreUpdate();
}
function triggerShowUpdateModal(seasons: any){
  selectShow(seasons);
  showShowModal.value = true;
}
function triggerShowApproveModal(seasons: any){
  selectShow(seasons);
  showApproveShowConfirm.value = true;
}
function triggerSeasonUpdateModal(episodes: Episode[]){
  selectSeason(episodes);
  showSeasonModal.value = true;
}
function triggerSeasonApprovalModal(episodes: Episode[]){
  selectSeason(episodes);
  showApproveSeasonConfirm.value = true;
}
function triggerEpisodeUpdateModal(episode: Episode){
  selectedEpisode.value = episode;
  showEpisodeModal.value = true;
}
function approveEpisode(episode: Episode){
  apiStore.postEpisode(episode).then((newEpisode)=>{
    toast(`${episode.ep_title} approved!`);
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
function deleteShow(seasons: any){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
function deleteSeason(episodes: Episode[]){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
function deleteEpisode(episode: Episode){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}

</script>

<template>
  <TvShowModal v-if="selectedShow" v-model="showShowModal" :show="selectedShow" :key="selectedShow.title" @close="showShowModal = false" />
  <TvShowConfirmModal v-if="selectedShow" v-model="showApproveShowConfirm" :show="selectedShow" :key="selectedShow.title" @close="showApproveShowConfirm = false" />
  <TvSeasonModal v-if="selectedSeason" v-model="showSeasonModal" :season="selectedSeason" :key="selectedSeason.show_title + selectedSeason.season_number" @close="showSeasonModal = false" />
  <TvSeasonConfirmModal v-if="selectedSeason" v-model="showApproveSeasonConfirm" :season="selectedSeason" :key="selectedSeason.show_title + selectedSeason.season_number" @close="showApproveSeasonConfirm = false" />
  <TVEpisodeModal v-if="selectedEpisode" v-model="showEpisodeModal" :episode="selectedEpisode" :key="selectedEpisode.file_path" @close="showEpisodeModal = false" />
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
        <BAccordion>
          <BAccordionItem v-for="(seasons, showLabel) in scanResults" :key="showLabel">
            <template #title>
              <div class="d-flex justify-content-between align-items-center w-100">
                <div>
                  <strong>{{showLabel}}</strong>
                  <span class="ms-2">{{getCtrlProperty(seasons,'genre')}}</span>
                </div>
                <BButtonGroup class="mx-3" size="sm">
                  <BButton variant="success" @click.stop="triggerShowApproveModal(seasons)">+</BButton>
                  <BButton variant="info" @click.stop="triggerShowUpdateModal(seasons)">~</BButton>
                  <BButton variant="info" :href="'https://en.wikipedia.org/wiki/List_of_' + showLabel.replace(' ','_') + '_episodes'" target="_blank">WIKI</BButton>
                  <BButton variant="danger" @click.stop="deleteShow(seasons)">x</BButton>
                </BButtonGroup>
              </div>
            </template>
            <BAccordion>
              <BAccordionItem v-for="(episodes, seasonLabel) in seasons" :key="seasonLabel">
                <template #title>
                  <div class="d-flex justify-content-between align-items-center w-100">
                    <div>
                      <strong>{{seasonLabel}}</strong>
                    </div>
                    <BButtonGroup class="mx-3" size="sm">
                      <BButton size="sm" variant="success" @click.stop="triggerSeasonApprovalModal(episodes)">+</BButton>
                      <BButton size="sm" variant="info" @click.stop="triggerSeasonUpdateModal(episodes)">~</BButton>
                      <BButton size="sm" variant="danger" @clic.stop="deleteSeason(episodes)">x</BButton>
                    </BButtonGroup>
                  </div>
                </template>
                <BListGroup>
                  <BListGroupItem v-for="e in episodes">
                    <div class="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <strong>{{e.ep_number}} | {{e.ep_title}}</strong>
                      </div>
                      <BButtonGroup size="sm">
                        <BButton variant="success" @click.stop="approveEpisode(e)">+</BButton>
                        <BButton variant="info" @click.stop="triggerEpisodeUpdateModal(e)">~</BButton>
                        <BButton variant="danger" @click.stop="deleteEpisode(e)">x</BButton>
                      </BButtonGroup>
                    </div>
                  </BListGroupItem>
                </BListGroup>
              </BAccordionItem>
            </BAccordion>
          </BAccordionItem>
        </BAccordion>
      </BCol>
    </BRow>
  </BContainer>
</template>
