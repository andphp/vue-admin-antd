import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import LoginLayout from "@/components/Layouts/LoginLayout";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    component: LoginLayout,
    name: "LoginLayout",
    redirect: { name: "login" },
    children: [
      {
        path: "/account/login",
        name: "login",
        component: () => import("../views/account/Login.vue"),
        hidden: true
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
