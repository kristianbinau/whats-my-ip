<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1>Your IP address: {{ ip }}</h1>
  </div>
</template>

<script setup lang="ts">
const { data: ip } = await useFetch('/api/app/ip')
</script>
