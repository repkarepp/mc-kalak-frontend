import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { authGuard, guestGuard } from "./guards";
import DashboardView from "@/views/dashboard/DashboardView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
    beforeEnter: guestGuard,
    meta: { requiresAuth: false, title: "Login" },
  },
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => DashboardView,
    beforeEnter: authGuard,
    meta: { requiresAuth: true, title: "Dashboard" },
  },
  // {
  //   path: '/claims/create',
  //   name: 'CreateClaim',
  //   component: () => import('@/views/claim/CreateClaimView.vue'),
  //   beforeEnter: authGuard,
  //   meta: { requiresAuth: true, title: 'Create Claim' }
  // },
  // {
  //   path: '/claims/:id',
  //   name: 'ClaimDetail',
  //   component: () => import('@/views/claim/ClaimDetailView.vue'),
  //   beforeEnter: authGuard,
  //   meta: { requiresAuth: true, title: 'Claim Detail' },
  //   props: true
  // },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFoundView.vue'),
  //   meta: { title: 'Page Not Found' }
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global navigation guard for setting page title
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string;
  document.title = title ? `${title} - MC Kalak` : "MC Kalak";
  next();
});

export default router;
