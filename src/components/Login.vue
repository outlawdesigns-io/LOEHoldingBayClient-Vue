<template>
  <form>
    <div class="imgcontainer">
        <img src="https://loe.outlawdesigns.io/Pictures/error/logo.png" alt="avatar" class="avatar">
    </div>
    <div class="container"></div>
</form>
</template>

<script setup lang="ts">

import { useApiStore } from '@/stores/api';
import { useRouter } from 'vue-router';

const router = useRouter();
const apiStore = useApiStore();

apiStore.ensureInitialized().then(()=>{
  apiStore.verifyToken().then(()=>{
    router.push('/home');
  });
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form{
    border:3px solid #f1f1f1;
}
.imgcontainer{
    text-align: center;
    margin:24px 0 12px 0;
}
img.avatar{
    /* width:40%; */
    border-radius: 50%;
    height: 350px;
    width: 350px;
}
span.psw{
    float:right;
    padding-top:16%;
}
@media screen and (max-width: 300px){
    span.psw {
        display: block;
        float: none;
    }
    .cancelbtn {
        width: 100%;
    }
}
</style>
