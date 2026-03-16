<script setup lang="ts">
import { useApiStore } from '@/stores/api';
import { useColorMode } from 'bootstrap-vue-next'

const apiStore = useApiStore();

const mode = useColorMode();

function logout(){
  console.log('logout...');
}
function swapTheme(){
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}

</script>

<template>
  <BNavbar toggleable="lg" type="dark">
    <BNavbarBrand router-link to="/home">LOE Holding Bay</BNavbarBrand>
    <BNavbarToggle target="nav-collapse"></BNavbarToggle>
    <BCollapse id="nav-collapse" is-nav>
      <BNavbarNav>
        <BNavItem router-link to="/movies">Movies</BNavItem>
        <BNavItem router-link to="/music">Music</BNavItem>
        <BNavItem router-link to="/tv">TV</BNavItem>
        <BNavItem router-link to="/anime">Anime</BNavItem>
        <BNavItem router-link to="/docs">Docs</BNavItem>
        <BNavItem router-link to="/comics">Comics</BNavItem>
      </BNavbarNav>
      <BNavbarNav class="ms-auto mb-2 mb-lg-0">
        <BNavItem right @click="logout()">log out</BNavItem>
        <BNavItem right @click="swapTheme()">
          <IBiMoon v-if="mode == 'light'" />
          <IBiSun v-if="mode == 'dark'" />
        </BNavItem>
      </BNavbarNav>
    </BCollapse>
  </BNavbar>
</template>
