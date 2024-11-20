// src/stores/user.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const preferences = ref(
    JSON.parse(localStorage.getItem("userPreferences")) || {
      darkMode: false,
      autoplay: true,
      notifyLikes: true,
      notifyComments: true,
      publicProfile: true,
      showActivity: true,
      avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
    }
  );

  const isAuthenticated = computed(() => user.value !== null);

  const setUser = (userData) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const updateProfile = (profileData) => {
    user.value = { ...user.value, ...profileData };
    localStorage.setItem("user", JSON.stringify(user.value));
  };

  const updatePreferences = (newPreferences) => {
    preferences.value = { ...preferences.value, ...newPreferences };
    localStorage.setItem("userPreferences", JSON.stringify(preferences.value));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
  };

  return {
    user,
    preferences,
    isAuthenticated,
    setUser,
    updateProfile,
    updatePreferences,
    logout,
  };
});
