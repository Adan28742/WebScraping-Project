<!-- src/layouts/MainLayout.vue -->
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <q-btn
          v-if="isAuthenticated"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Video Analysis Dashboard </q-toolbar-title>

        <q-btn-dropdown
          flat
          round
          dense
          icon="account_circle"
          v-if="isAuthenticated"
        >
          <q-list>
            <q-item clickable v-close-popup @click="$router.push('/perfil')">
              <q-item-section avatar>
                <q-avatar size="32px">
                  <img :src="userAvatar" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ username }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Cerrar sesión</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>

      <q-tabs v-if="isAuthenticated">
        <q-route-tab to="/" label="Inicio" icon="home" />
        <q-route-tab to="/favoritos" label="Me gusta" icon="favorite" />
        <q-route-tab to="/guardados" label="Guardados" icon="bookmark" />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="true"
      :width="200"
      bordered
      show-if-above
      class="bg-white"
    >
      <q-list>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/favoritos">
          <q-item-section avatar>
            <q-icon name="favorite" />
          </q-item-section>
          <q-item-section>Me gusta</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/guardados">
          <q-item-section avatar>
            <q-icon name="bookmark" />
          </q-item-section>
          <q-item-section>Guardados</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";

const router = useRouter();
const userStore = useUserStore();

const leftDrawerOpen = ref(false);
const isAuthenticated = computed(() => userStore.isAuthenticated);
const username = computed(() => userStore.user?.username || "Usuario");
const userAvatar = computed(
  () =>
    userStore.preferences?.avatar || "https://cdn.quasar.dev/img/boy-avatar.png"
);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleLogout = async () => {
  userStore.logout();
  router.push("/auth/login");
};
</script>

<style scoped>
.q-item.q-router-link-active {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.1);
}

.q-item.q-router-link-active .q-icon {
  color: #1976d2;
}
</style>
