// src/router/index.js
import { route } from "quasar/wrappers";
import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import { firebaseAuth } from "src/config/firebase";

export default route(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    // Ya que estás usando modo hash en quasar.config.js
    history: createWebHashHistory(),
  });

  Router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const isAuthRoute = to.path.startsWith("/auth");

    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (requiresAuth && !user) {
        next("/auth/login");
      } else if (isAuthRoute && user) {
        next("/");
      } else {
        next();
      }
      unsubscribe(); // Limpiar el listener después de la primera ejecución
    });
  });

  return Router;
});
