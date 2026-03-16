<template>
  <h3 v-if="error">{{error.error}}</h3>
  <p v-if="error">{{error.description}}</p>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApiStore } from '@/stores/api';
import type { OauthError } from '@/types/OauthError';

const route = useRoute();
const router = useRouter();
const apiStore = useApiStore();

const error = ref<OauthError | null>(null);

if(route.query.code){
  apiStore.ensureInitialized().then(()=>{
    const code = route.query.code;
    if(typeof code === "string"){
      apiStore.swapAuthorizationToken(code).then(()=>{
        router.push('/home');
      });
    }
  });
}else if(route.query.error){
  const errorStr = route.query.error;
  const description = route.query.error_description;
  error.value = {
    error: typeof errorStr === "string" ? errorStr : "",
    description: typeof description === "string" ? description : ""
  };
}else{
  error.value = {
    error: "An unknown error has occurred",
    description: "Please try again later."
  };
}



</script>
