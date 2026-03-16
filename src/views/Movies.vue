<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';
import type { Movie } from '@/types/Movie';
import MovieCoverModal from '../components/MovieCoverModal.vue';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const apiStore = useApiStore();
const loading = ref(true);
const showCoverModal = ref(false);
const selectedMovie = ref<Movie | null>(null);

const movies = computed(()=>{
  return apiStore.movies;
});

apiStore.ensureInitialized().then(()=>{
  if(apiStore.movies.length === 0){
    triggerStoreUpdate();
    return;
  }
  loading.value = false;
});

function triggerStoreUpdate(){
  apiStore.getMovies().then(()=>{
    loading.value = false;
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
function triggerLibraryRescan(){
  loading.value = true;
  triggerStoreUpdate();
}
function triggerMoviePreviewWindow(movie: Movie){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
function approveMovie(movie: Movie){
  apiStore.postMovie(movie).then((newMovie)=>{
    toast(`${movie.title} approved!`);
  }).catch((err)=>{
    toast(`${err.message}\\nSee console for more details.`,{type:'error',autoClose:3000});
  });
}
function deleteMovie(movie: Movie){
  toast("Please Implement this method!",{type:'error',autoClose:3000});
}
function triggerMovieCoverModal(movie: Movie){
  selectedMovie.value = movie;
  showCoverModal.value = true;
}
</script>

<template>
  <MovieCoverModal v-if="selectedMovie" v-model="showCoverModal" @close="showCoverModal = false" :movie="selectedMovie" />
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
        <BAccordion v-for="movie in movies">
          <BAccordionItem>
            <template #title>
              <div class="d-flex justify-content-between align-items-center w-100">
                <div>
                  <strong>{{movie.title}}</strong>
                </div>
                <BButtonGroup size="sm">
                  <BButton variant="info" @click.stop="triggerMoviePreviewWindow(movie)">></BButton>
                  <BButton variant="success" @click.stop="approveMovie(movie)">+</BButton>
                  <BButton variant="danger" @click.stop="deleteMovie(movie)">x</BButton>
                </BButtonGroup>
              </div>
            </template>
            <BRow>
              <BCol>
                <BFormGroup label="Title:" label-for="movie-title">
                  <BFormInput id="movie-title" v-model="movie.title"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol></BCol>
              <BCol>
                <img :src="movie.cover_path" @click="triggerMovieCoverModal(movie)" alt="Upload an Image" height="80" width="60" style="float:right">
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Year:" label-for="movie-year">
                  <BFormInput id="movie-year" v-model="movie.relyear"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Rating:" label-for="movie-rating">
                  <BFormInput id="movie-rating" v-model="movie.rating"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Length:" label-for="movie-run_time">
                  <BFormInput id="movie-run_time" v-model="movie.run_time"></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Genre 1:" label-for="movie-genre">
                  <BFormInput id="movie-genre" v-model="movie.genre"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Genre 2:" label-for="movie-genre2">
                  <BFormInput id="movie-genre2" v-model="movie.genre2"></BFormInput>
                </BFormGroup>
              </BCol>
              <BCol>
                <BFormGroup label="Genre 3:" label-for="movie-genre3">
                  <BFormInput id="movie-genre3" v-model="movie.genre3"></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Director:" label-for="movie-director">
                  <BFormInput id="movie-director" v-model="movie.director"></BFormInput>
                </BFormGroup>
              </BCol>
            </BRow>
            <BRow>
              <BCol>
                <BFormGroup label="Description:" label-for="movie-description">
                  <BFormTextarea id="movie-description" v-model="movie.description" rows="4" />
                </BFormGroup>
              </BCol>
            </BRow>
          </BAccordionItem>
        </BAccordion>
      </BCol>
    </BRow>
  </BContainer>
</template>
