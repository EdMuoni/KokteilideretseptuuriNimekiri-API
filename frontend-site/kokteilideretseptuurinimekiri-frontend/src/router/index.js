import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: "/about",
    name: "about",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: { requiresAuth: false }
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/RegisterView.vue"),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: "/recipes",
    name: "recipes",
    component: () => import("../views/RecipesView.vue"),

    // PROTECTED ROUTE
    meta: { requiresAuth: true } 
  },
  {
    path: "/recipe/:seekID",
    name: "recipe",
    component: () => import("../views/SingleRecipeView.vue"),
    props: (route) => {
      return { seekID: String(route.params.seekID) };
    },

    //  PROTECTED ROUTE
    meta: { requiresAuth: true } 
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// NAVIGATION GUARD - Protects routes!
router.beforeEach((to, from, next) => {
  // Check if user is logged in
  const isLoggedIn = checkAuth();
  
  console.log('Navigation Guard:', {
    going_to: to.path,
    requires_auth: to.meta.requiresAuth,
    is_logged_in: isLoggedIn
  });
  
  // If route requires authentication and user is NOT logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    console.log(' Access denied - redirecting to login');
    // Redirect to login page
    next({
      name: 'login',
      query: { redirect: to.fullPath } 
    });
  }

  // If route is guest-only (login/register) and user IS logged in
  else if (to.meta.guestOnly && isLoggedIn) {
    console.log(' Already logged in - redirecting to recipes');
    // Redirect to recipes page
    next({ name: 'recipes' });
  }
  // Otherwise, allow navigation
  else {
    console.log(' Access granted');
    next();
  }
});

// Helper function to check if user is authenticated
function checkAuth() {
  // Check if user session exists in localStorage
  const userSession = localStorage.getItem('user');
  return userSession !== null && userSession !== undefined;
}

export default router;