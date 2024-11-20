<!-- src/pages/GuardadosPage.vue -->
<template>
  <div class="saved-container">
    <h2 class="page-title">Guardados</h2>
    <div class="videos-grid">
      <div
        v-for="video in savedVideos"
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
        <div class="video-info">
          <div class="info-row">
            <span class="category">Categoría {{ video.idCategoria }}</span>
            <span class="duration">{{ formatDuration(video.duracion) }}</span>
          </div>
          <div class="date">{{ formatDate(video.fechaCreacion) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useVideoStore } from "stores/video";

const videoStore = useVideoStore();
const savedVideos = computed(() => videoStore.getSavedVideos());

const getEmbedUrl = (url) => {
  const fileId = url.match(/\/d\/(.*?)\/view/)?.[1];
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
</script>

<style scoped>
.saved-container {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8rem;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.video-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.video-info {
  padding: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.category {
  font-weight: 600;
  color: #0396ff;
}

.duration {
  color: #666;
  font-size: 0.9em;
}

.date {
  color: #888;
  font-size: 0.8em;
}
</style>
