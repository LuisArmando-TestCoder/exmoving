"use client";

import { Reveal } from "../../ui/Common";
import styles from "../Architecture.module.scss";

export function Vision() {
  return (
    <Reveal className={styles.visionSection} distance={40}>
      <p className={styles.philosophy}>
        "To lead is to make happen, to lead greatly, is about how it happens, but the best leaders are all about why it's happening."
      </p>
      
      <div className={styles.equation}>
        Σx where f(y) = x
      </div>
    </Reveal>
  );
}
