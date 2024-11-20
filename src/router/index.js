// src/router/index.js
import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useUserStore } from "src/stores/user";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 */

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
    const userStore = useUserStore();
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth && !userStore.isAuthenticated) {
      next("/auth/login");
    } else if (
      (to.path === "/auth/login" || to.path === "/auth/register") &&
      userStore.isAuthenticated
    ) {
      next("/");
    } else {
      next();
    }
  });

  return Router;
});
