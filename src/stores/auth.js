// src/stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // Estado
  const user = ref(null);
  const isAuthenticated = computed(() => user.value !== null);

  // Acciones
  const login = async (email, password) => {
    // Usuario de prueba para desarrollo
    if (email === "admin@admin.com" && password === "admin") {
      const userData = {
        id: 1,
        email: "admin@admin.com",
        username: "Admin",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
      };
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return Promise.resolve(userData);
    }

    // Verificar usuarios registrados
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.nombres,
        avatar: foundUser.avatar || "https://cdn.quasar.dev/img/boy-avatar.png",
      };
      user.value = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      return Promise.resolve(userData);
    }

    return Promise.reject(new Error("Credenciales incorrectas"));
  };

  const register = async ({ nombres, apellidos, email, password }) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u) => u.email === email)) {
      return Promise.reject(
        new Error("Este correo electrónico ya está registrado")
      );
    }

    const newUser = {
      id: users.length + 1,
      nombres,
      apellidos,
      email,
      password,
      createdAt: new Date().toISOString(),
      avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return Promise.resolve(newUser);
  };

  // src/stores/auth.js - actualizar la función logout
  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
    localStorage.removeItem("rememberedEmail"); // También limpiar el email recordado
  };

  // Inicialización - Recuperar sesión si existe
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
