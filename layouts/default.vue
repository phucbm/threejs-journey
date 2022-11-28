<script setup>
const routes = useRouter().options.routes;
const excluded = ['00', 'index'];
const menuItems = computed(() => {
  return routes.filter(e => !excluded.includes(e.name));
});
</script>

<template>


  <nav class="ps-fixed b0 l0 w100 z2 d-flex jc-space-between">

    <NuxtLink :to="{name:'index'}" class="fw-bold">ThreeJs Journey</NuxtLink>

    <ul class="d-flex">
      <li v-for="route in menuItems">
        <NuxtLink :to="route.path">{{ route.name }}</NuxtLink>
      </li>
    </ul>

  </nav>


  <slot/>
</template>

<style scoped>
nav {
  background:rgba(0, 0, 0, .6);
  padding:15px 20px;
  backdrop-filter:blur(2px);
}
nav ul {
  list-style:none;
  gap:20px;
}
nav a {color:#fff;}
</style>