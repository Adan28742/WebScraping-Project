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
