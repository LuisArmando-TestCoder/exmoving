"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, LayoutGrid } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import styles from "./Breadcrumbs.module.scss";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbsWrapper}>
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link href="/" className={styles.link} aria-label="Home">
            <div className={styles.iconContainer}>
              <LayoutGrid size={14} className={styles.homeIcon} />
            </div>
            <span className={styles.text}>Home</span>
          </Link>
        </li>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

          return (
            <li key={path} className={styles.breadcrumbItem}>
              <ChevronRight size={14} className={styles.separator} aria-hidden="true" />
              {isLast ? (
                <div className={`${styles.link} ${styles.active}`} aria-current="page">
                  <span className={styles.text}>{name}</span>
                  <div className={styles.glow} />
                </div>
              ) : (
                <Link href={path} className={styles.link}>
                  <span className={styles.text}>{name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
