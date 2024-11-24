<!-- src/pages/FavoritosPage.vue -->
<template>
  <div class="favorites-container">
    <h2 class="page-title">Mis Me Gusta</h2>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <q-spinner color="primary" size="3em" />
      <p>Cargando videos...</p>
    </div>

    <!-- Mensaje cuando no hay videos -->
    <div v-else-if="likedVideos.length === 0" class="empty-state">
      <q-icon name="favorite_border" size="4em" color="grey-5" />
      <p>Aún no has dado me gusta a ningún video</p>
      <q-btn
        color="primary"
        label="Explorar videos"
        :to="{ name: 'home' }"
        icon="home"
      />
    </div>

    <!-- Grid de videos -->
    <div v-else class="videos-grid">
      <q-card
        v-for="video in likedVideos"
        :key="video.idVideoGenerado"
        class="video-card"
      >
        <div class="video-preview">
          <iframe
            :src="getEmbedUrl(video.linkVideo)"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <q-card-section>
          <div class="text-h6 ellipsis">{{ video.title || "Sin título" }}</div>
          <div class="info-row">
            <div class="category">Categoría {{ video.idCategoria }}</div>
            <div class="duration">{{ formatDuration(video.duracion) }}</div>
          </div>
          <div class="date">{{ formatDate(video.fechaCreacion) }}</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            round
            :color="video.liked ? 'red' : 'grey'"
            icon="favorite"
            @click="toggleLike(video)"
          >
            <q-tooltip>Quitar de me gusta</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            :color="video.saved ? 'primary' : 'grey'"
            icon="bookmark"
            @click="toggleSave(video)"
          >
            <q-tooltip>{{ video.saved ? "Guardado" : "Guardar" }}</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useVideoStore } from "src/stores/video";
import { useQuasar } from "quasar";

const $q = useQuasar();
const videoStore = useVideoStore();

const loading = computed(() => videoStore.loading);
const likedVideos = computed(() => videoStore.likedVideos);

const getEmbedUrl = (url) => {
  const videoId = url.match(/[-\w]{25,}/)?.[0];
  return `https://drive.google.com/file/d/${videoId}/preview`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const toggleLike = (video) => {
  videoStore.toggleLike(video.idVideoGenerado);
  $q.notify({
    message: video.liked
      ? "Video eliminado de me gusta"
      : "Video añadido a me gusta",
    color: video.liked ? "negative" : "positive",
    icon: "favorite",
  });
};

const toggleSave = (video) => {
  videoStore.toggleSave(video.idVideoGenerado);
  $q.notify({
    message: video.saved ? "Video guardado" : "Video eliminado de guardados",
    color: video.saved ? "positive" : "negative",
    icon: "bookmark",
  });
};
</script>

<style scoped>
.favorites-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 24px;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 600;
}

.loading-state,
.empty-state {
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #666;
}

.empty-state p {
  margin: 16px 0;
  font-size: 1.1rem;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.video-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.video-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.video-preview {
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.video-preview iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.category {
  font-weight: 500;
  color: #1976d2;
}

.duration {
  color: #666;
  font-size: 0.9em;
}

.date {
  color: #888;
  font-size: 0.8em;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
