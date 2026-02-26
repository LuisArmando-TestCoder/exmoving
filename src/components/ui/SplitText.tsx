"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import styles from "./SplitText.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextProps {
  id: string;
  children: string;
  className?: string;
  delay?: number;
}

export const SplitText: React.FC<SplitTextProps> = ({ id, children, className, delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Select all elements with the char class across all word spans
    const chars = ref.current.querySelectorAll(`.${styles.char}`);

    gsap.fromTo(
      chars,
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom", // Start when top of element hits bottom of viewport
          end: "center center", // End when center of element hits center of viewport
          scrub: 1,
        },
      }
    );
  }, [delay]);

  useEffect(() => {
    // Force refresh to ensure positions are correct after mount/layout changes
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <span id={id} ref={ref} className={clsx(styles.wrapper, className)}>
      {children.split(" ").map((word, wordIndex) => (
        <span key={wordIndex} className={styles.word} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {word.split("").map((char, charIndex) => (
            <span key={charIndex} className={styles.char}>
              {char}
            </span>
          ))}
          {/* Add a space after each word except the last one */}
          {wordIndex < children.split(" ").length - 1 && (
            <span className={styles.char} style={{ display: "inline" }}>
              {"\u00A0"}
            </span>
          )}
        </span>
      ))}
    </span>
  );
};
