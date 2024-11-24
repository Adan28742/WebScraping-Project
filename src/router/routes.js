// src/router/routes.js
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "favoritos",
        name: "favoritos",
        component: () => import("pages/FavoritosPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "guardados",
        name: "guardados",
        component: () => import("pages/GuardadosPage.vue"),
        meta: { requiresAuth: true },
      },
      {
        path: "perfil",
        name: "perfil",
        component: () => import("pages/PerfilPage.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/RegisterPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

// src/stores/auth.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // Estado
  const user = ref(null);
  const isAuthenticated = ref(false);

  // Acciones
  function login(email, password) {
    // Usuario de prueba para desarrollo
    if (email === "admin@admin.com" && password === "admin") {
      const userData = {
        id: 1,
        email: "admin@admin.com",
        username: "Admin",
        avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
      };
      user.value = userData;
      isAuthenticated.value = true;
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
      isAuthenticated.value = true;
      localStorage.setItem("user", JSON.stringify(userData));
      return Promise.resolve(userData);
    }

    return Promise.reject(new Error("Credenciales incorrectas"));
  }

  function register({ nombres, apellidos, email, password }) {
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
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("user");
  }

  // Inicialización - Recuperar sesión si existe
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    isAuthenticated.value = true;
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };
});
