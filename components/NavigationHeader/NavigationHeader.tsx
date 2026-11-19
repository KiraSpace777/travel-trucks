"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";
import styles from "./NavigationHeader.module.css";

const subscribeToClientMount = () => () => {};

export const NavigationHeader = () => {
  const currentActivePathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const isClientMounted = useSyncExternalStore(
    subscribeToClientMount,
    () => true,
    () => false,
  );

  const isCatalogPageActive = currentActivePathname === "/catalog";
  const isDarkThemeActive = isClientMounted && resolvedTheme === "dark";

  const handleToggleThemeClick = () => {
    setTheme(isDarkThemeActive ? "light" : "dark");
  };

  return (
    <header
      className={`${styles.navigationContainer} ${
        isCatalogPageActive ? styles.stickyNavigationContainer : ""
      }`.trim()}
    >
      <div className={styles.navigationContent}>
        <Link href="/" className={styles.brandLogoWrapper} aria-label="TravelTrucks Home">
          <svg className={styles.brandLogoIcon}>
            <use href="/sprite.svg#logo-brand" />
          </svg>
        </Link>
        <nav className={styles.navigationLinksList}>
          <Link
            href="/"
            className={`${styles.navigationLinkItem} ${
              currentActivePathname === "/" ? styles.activeNavigationLinkItem : ""
            }`.trim()}
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className={`${styles.navigationLinkItem} ${
              isCatalogPageActive ? styles.activeNavigationLinkItem : ""
            }`.trim()}
          >
            Catalog
          </Link>
        </nav>
        <div className={styles.themeControlsWrapper}>
          <button
            type="button"
            onClick={handleToggleThemeClick}
            className={styles.themeToggleButton}
            aria-label="Toggle color theme"
          >
            {isDarkThemeActive ? (
              <FiSun className={styles.themeToggleIcon} />
            ) : (
              <FiMoon className={styles.themeToggleIcon} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
