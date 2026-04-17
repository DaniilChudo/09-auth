"use client";

import { useAuthStore } from "../../lib/store/authStore";
import { logout } from "../../lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const { user, isAuthenticated, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    window.location.href = "/sign-in";
  };

  if (isAuthenticated && user) {
    return (
      <>
        <li className={css.navigationItem}>
          <a href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </a>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user.email}</p>
          <button className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <a href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </a>
      </li>
      <li className={css.navigationItem}>
        <a href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </a>
      </li>
    </>
  );
}
