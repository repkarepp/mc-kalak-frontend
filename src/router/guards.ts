import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "@/stores/auth";

export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const authStore = useAuthStore();

  if (!authStore.isLoggedIn) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
}

export function guestGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void {
  const authStore = useAuthStore();

  if (authStore.isLoggedIn) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
}
