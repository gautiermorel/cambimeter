import { createWebHistory, createRouter } from "vue-router";
import store from "@/store";

import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    beforeEnter:  (to, from, next) => next("/")
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: to => {
    if (to.hash) return { el: to.hash }
    return { x: 0, y: 0 }
  },
});

// Clear the error on every navigation
router.afterEach(() => {
  store.commit("clearError");
});

export default router;
