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

        <q-toolbar-title>TokNews</q-toolbar-title>

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

      <q-tabs v-if="isAuthenticated" align="center">
        <q-route-tab to="/" label="Inicio" icon="home" />
        <q-route-tab to="/favoritos" label="Me gusta" icon="favorite" />
        <q-route-tab to="/guardados" label="Guardados" icon="bookmark" />
        <q-route-tab to="/perfil" label="Perfil" icon="person" />
      </q-tabs>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :width="200"
      bordered
      show-if-above
      class="bg-white"
    >
      <q-list padding>
        <q-item clickable v-ripple to="/" exact>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/favoritos" exact>
          <q-item-section avatar>
            <q-icon name="favorite" />
          </q-item-section>
          <q-item-section>Me gusta</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/guardados" exact>
          <q-item-section avatar>
            <q-icon name="bookmark" />
          </q-item-section>
          <q-item-section>Guardados</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/perfil" exact>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Perfil</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);
const miniState = ref(true);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const username = computed(() => authStore.user?.username || "Usuario");
const userAvatar = computed(
  () =>
    authStore.user?.avatar ||
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
);

// Watch para el modo oscuro
watch(
  () => userStore.preferences.darkMode,
  (newValue) => {
    $q.dark.set(newValue);
  },
  { immediate: true }
);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    $q.notify({
      type: "positive",
      message: "Sesión cerrada exitosamente",
    });
    router.push("/auth/login");
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al cerrar sesión",
    });
  }
};
</script>

<style scoped>
.q-toolbar {
  min-height: 60px;
}

.q-tabs {
  height: 45px;
}

.q-tab {
  min-height: 45px;
}

.q-item.q-router-link-exact-active {
  color: #1976d2;
  background: rgba(25, 118, 210, 0.1);
}

.q-item.q-router-link-exact-active .q-icon {
  color: #1976d2;
}

.q-drawer {
  background: #f5f5f5;
}

.q-list {
  padding: 8px;
}

.q-item {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.3s ease;
}

.q-item:hover {
  background: rgba(25, 118, 210, 0.05);
}

/* Estilos para el modo oscuro */
.body--dark {
  .q-drawer {
    background: #1d1d1d;
  }

  .q-item.q-router-link-exact-active {
    background: rgba(255, 255, 255, 0.1);
  }

  .q-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

/* Transiciones */
.q-drawer--mini .q-item {
  padding: 8px;
  justify-content: center;
}

/* Animaciones para el avatar */
.q-avatar {
  transition: transform 0.3s ease;
}

.q-avatar:hover {
  transform: scale(1.05);
}

/* Estilos para el menú desplegable */
.q-menu {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .q-toolbar-title {
    font-size: 1.1rem;
  }

  .q-tabs {
    height: 40px;
  }

  .q-tab {
    min-height: 40px;
    padding: 0 12px;
  }
}
</style>
