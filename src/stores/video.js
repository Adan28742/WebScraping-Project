// src/stores/video.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./user";

export const useVideoStore = defineStore("video", () => {
  const videos = ref([
    {
      idVideoGenerado: 1,
      idCategoria: 1,
      fechaCreacion: "2024-11-05T22:23:51.693",
      linkVideo:
        "https://drive.google.com/file/d/1GEd0buzM3R4VyBuVly3Ayh1Rl8YfEMki/view?usp=drive_link",
      estado: true,
      duracion: 10,
      liked: false,
      saved: false,
      comments: [],
    },
    {
      idVideoGenerado: 2,
      idCategoria: 2,
      fechaCreacion: "2024-11-05T22:24:51.693",
      linkVideo:
        "https://drive.google.com/file/d/1p0FwI2QgInjEty5T3pRNi5N7MCVdu-eL/view?usp=drive_link",
      estado: true,
      duracion: 15,
      liked: false,
      saved: false,
      comments: [],
    },
    {
      idVideoGenerado: 3,
      idCategoria: 1,
      fechaCreacion: "2024-11-05T22:25:51.693",
      linkVideo:
        "https://drive.google.com/file/d/19wVQTOwyds9QhfaDI-3l128WO_W0CJfB/view?usp=drive_link",
      estado: true,
      duracion: 12,
      liked: false,
      saved: false,
      comments: [],
    },
  ]);

  // Getters
  const likedVideos = computed(() =>
    videos.value.filter((video) => video.liked)
  );
  const savedVideos = computed(() =>
    videos.value.filter((video) => video.saved)
  );

  // Actions
  function toggleLike(videoId) {
    const video = videos.value.find((v) => v.idVideoGenerado === videoId);
    if (video) {
      video.liked = !video.liked;
      // Guardar en localStorage
      saveToLocalStorage();
    }
  }

  function toggleSave(videoId) {
    const video = videos.value.find((v) => v.idVideoGenerado === videoId);
    if (video) {
      video.saved = !video.saved;
      // Guardar en localStorage
      saveToLocalStorage();
    }
  }

  function addComment(videoId, commentText) {
    const video = videos.value.find((v) => v.idVideoGenerado === videoId);
    if (video) {
      const userStore = useUserStore();
      const comment = {
        id: Date.now(),
        text: commentText,
        username: userStore.user?.username || "Usuario",
        avatar:
          userStore.preferences?.avatar ||
          "https://cdn.quasar.dev/img/boy-avatar.png",
        date: new Date().toISOString(),
      };
      video.comments.push(comment);
      // Guardar en localStorage
      saveToLocalStorage();
    }
  }

  // LocalStorage
  function saveToLocalStorage() {
    localStorage.setItem("videos", JSON.stringify(videos.value));
  }

  function loadFromLocalStorage() {
    const savedVideos = localStorage.getItem("videos");
    if (savedVideos) {
      videos.value = JSON.parse(savedVideos);
    }
  }

  // Cargar datos al iniciar
  loadFromLocalStorage();

  return {
    videos,
    likedVideos,
    savedVideos,
    toggleLike,
    toggleSave,
    addComment,
  };
});
