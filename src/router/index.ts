import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/Login.vue'
import AuthCallbackHandler from '../components/AuthCallbackHandler.vue';
import Movies from '../views/Movies.vue';
import Music from '../views/Music.vue';
import Tv from '../views/Tv.vue';
import Comics from '../views/Comics.vue';
import Anime from '../views/Anime.vue';
import Docs from '../views/Docs.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/token',
      name: 'token',
      component: AuthCallbackHandler
    },
    {
      path: '/movies',
      name: 'movies',
      component: Movies
    },
    {
      path: '/music',
      name: 'music',
      component: Music
    },
    {
      path: '/tv',
      name: 'tv',
      component: Tv
    },
    {
      path: '/comics',
      name: 'comics',
      component: Comics
    },
    {
      path: '/docs',
      name: 'docs',
      component: Docs
    },
    {
      path: '/anime',
      name: 'anime',
      component: Anime
    },
  ],
})

export default router
