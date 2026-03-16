<script setup lang="ts">
import { ref, computed } from 'vue';
import { useApiStore } from '@/stores/api';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const apiStore = useApiStore();
const loading = ref(false);
</script>

<template>
  <BContainer>
    <BRow>
      <BCol v-if="loading">
        <BSpinner label="loading" class="mx-1" />
      </BCol>
      <BCol v-else>
        <h3>This interface has not yet been implemented.</h3>
        <br>
        <h4>Check back soon!</h4>
      </BCol>
    </BRow>
  </BContainer>
</template>
