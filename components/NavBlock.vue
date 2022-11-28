<script setup>
const routes = useRouter().options.routes;
const excluded = ['00', 'index'];
const menuItems = computed(() => {
  return routes.filter(e => !excluded.includes(e.name));
});

let isVisible = ref(true);
</script>

<template>
  <nav class="nav ps-fixed z2 d-flex jc-space-between t fw-wrap" :class="{visible:isVisible}">

    <div class="fl-center" style="gap:10px;">
      <NuxtLink :to="{name:'index'}" class="fw-bold">ThreeJS Journey</NuxtLink>
    </div>

    <ul class="d-flex">
      <li v-for="route in menuItems">
        <NuxtLink :to="route.path">{{ route.name }}</NuxtLink>
      </li>
    </ul>

    <div class="ps-absolute b100p r0">
      <button @click="isVisible=!isVisible" class="menu-toggle fl-center">
        {{ isVisible ? 'Close' : 'Open' }}
      </button>
    </div>

  </nav>
</template>

<style scoped>
.nav {
  background:rgba(0, 0, 0, .6);
  padding:15px 20px;
  backdrop-filter:blur(2px);
  left:10px; right:10px; bottom:10px;
  border-radius:12px 0 12px 12px;
  box-shadow:0 0 5px rgba(0, 0, 0, .4);
}
.nav:not(.visible) {
  transform:translateY(calc(100% + 10px));
}

.nav ul {
  list-style:none;
  gap:20px;
}
.nav a {color:#fff;}

.menu-toggle {
  box-shadow:0 0 5px rgba(0, 0, 0, .2);
  width:45px; aspect-ratio:1;
  background:#fff; border-radius:10px 10px 0 0;
  font-size:12px;
  cursor:pointer;
}
</style>