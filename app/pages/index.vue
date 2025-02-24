<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <h1>
      Your IP address:
      <span class="text-(--ui-primary)">{{ ip }}</span>
    </h1>

    <template v-if="registryInfo">
      <p>
        Your Location: <span>{{ location }}</span>
      </p>
      <p>
        Your Provider: <span>{{ provider }}</span>
      </p>

      <div class="flex gap-2">
        <UBadge
          v-if="isVPN"
          icon="i-lucide-network"
          color="warning"
          variant="outline"
          label="VPN Connection"
        />

        <UBadge
          v-if="isProxy"
          icon="i-lucide-network"
          color="info"
          variant="outline"
          label="Proxy Connection"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { data: ip } = await useFetch("/api/app/ip");
const { data: registryInfo } = await useFetch("/api/app/registry");

const location = computed(() => {
  if (!registryInfo.value) return "";

  return `${registryInfo.value.location.continent.name}, ${registryInfo.value.location.country.name}, ${registryInfo.value.location.city}`;
});

const provider = computed(() => {
  if (!registryInfo.value) return "";

  return registryInfo.value.connection.organization;
});

const isVPN = computed(() => {
  if (!registryInfo.value) return false;

  return registryInfo.value.security.is_vpn;
});

const isProxy = computed(() => {
  if (!registryInfo.value) return false;

  return registryInfo.value.security.is_proxy;
});
</script>
