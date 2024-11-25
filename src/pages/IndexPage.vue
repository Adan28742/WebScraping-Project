<!-- src/pages/IndexPage.vue -->
<template>
  <q-page>
    <keep-alive>
      <DashboardFeed />
    </keep-alive>
  </q-page>
</template>

<script setup>
import DashboardFeed from "components/DashboardFeed.vue";
</script>
