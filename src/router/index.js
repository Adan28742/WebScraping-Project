// src/router/index.js
import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useAuthStore } from "src/stores/auth";

export default route(function ({ ssrContext }) {
  let createHistory;

  if (typeof ssrContext !== "undefined") {
    createHistory = createMemoryHistory;
  } else {
    createHistory =
      window.location.protocol === "file:"
        ? createWebHashHistory
        : createWebHistory;
  }

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory("/WebScraping-Project/"),
  });

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth && !authStore.isAuthenticated) {
      next("/auth/login"); // Quitamos el prefijo, el router lo manejará automáticamente
    } else if (
      (to.path === "/auth/login" || to.path === "/auth/register") &&
      authStore.isAuthenticated
    ) {
      next("/"); // Quitamos el prefijo, el router lo manejará automáticamente
    } else {
      next();
    }
  });

  return Router;
});
