<script setup>
const routes = useRouter().options.routes;
const route = useRoute();

const excluded = ['00', 'index'];
const menuItems = computed(() => {
  return routes.filter(e => !excluded.includes(e.name));
});

let isVisible = ref(true);
</script>

<template>
  <nav class="nav ps-fixed z2 t" :class="{visible:isVisible}">

    <div style="margin-bottom:20px;">
      <NuxtLink :to="{name:'index'}" class="logo fw-bold">ThreeJS Journey</NuxtLink>
    </div>

    <ul class="menu d-flex fd-column">
      <li v-for="route in menuItems" class="w-100">
        <a :href="route.path" class="d-block">
          <span v-if="!isNaN(route.name)">{{ route.name }}</span>
          <span v-if="!isNaN(route.name) && route.meta.title"> - </span>
          <span v-if="route.meta.title">{{ route.meta.title }}</span>
        </a>
      </li>
    </ul>

    <div class="ps-absolute l100p t0">
      <button @click="isVisible=!isVisible" class="menu-toggle fl-center us-none ps-relative bar-circle c-pointer">
        <span class="menu-toggle__inner ps-relative">
          <i class="ps-absolute l0 d-block t"></i>
          <i class="ps-absolute l0 d-block t"></i>
          <i class="ps-absolute l0 d-block t"></i>
        </span>
      </button>
    </div>

  </nav>
</template>

<style scoped>
.logo {
  color:#fff;
}

.nav {
  left:0; top:0; bottom:0;
  background:rgba(0, 0, 0, .6);
  padding:15px 20px;
  backdrop-filter:blur(2px);
  box-shadow:0 0 5px rgba(0, 0, 0, .4);
  gap:15px 20px;
  min-width:200px;
}
.nav:not(.visible) {
  transform:translateX(-100%);
}

.nav ul.menu {
  list-style:none;
  gap:5px 10px;
}
.nav ul.menu a {
  color:#fff; padding:5px 10px; border-radius:5px;
  background:rgba(255, 255, 255, .1);
}
.nav ul.menu a.router-link-active {
  background:#fff;
  color:#000;
}


/****************************
 * Hamburger button
****************************/
.menu-toggle {
  box-shadow:0 0 5px rgba(0, 0, 0, .2);
  width:45px; aspect-ratio:1;
  background:deepskyblue; color:#fff;
  margin:10px;
}

.menu-toggle__inner {width:15px; height:12px;}

/* Lines */
.menu-toggle__inner i {width:100%; height:2px; border-radius:2px; background:#fff;}
.menu-toggle__inner i:nth-child(1) {top:0;}
.menu-toggle__inner i:nth-child(2) {top:5px; width:8px;}
.menu-toggle__inner i:nth-child(3) {bottom:0; width:11px;}

/* Open */
.nav.visible .menu-toggle__inner i:nth-child(1) {transform:rotate(45deg); top:5px;}
.nav.visible .menu-toggle__inner i:nth-child(3) {transform:rotate(-45deg); bottom:5px; width:100%;}
.nav.visible .menu-toggle__inner i:nth-child(2) {width:0; left:200%; opacity:0;}
</style>