"use client";

import { MotionValue } from "framer-motion";
import styles from "../Hero.module.scss";
import { TitleText } from "./TitleText";
import { SubtitleText } from "./SubtitleText";

interface HeroTitleProps {
  isInView: boolean;
  smoothXTitle: MotionValue<number>;
  opacityContent: MotionValue<number>;
  blurContent: MotionValue<string | any>;
  scrollYProgress: MotionValue<number>;
}

export function HeroTitle({
  isInView,
  smoothXTitle,
  opacityContent,
  blurContent,
}: HeroTitleProps) {
  return (
    <div className={styles.titleContainer} style={{ perspective: "1000px" }}>
      {isInView && (
        <TitleText 
          isInView={isInView}
          smoothXTitle={smoothXTitle}
          opacityContent={opacityContent}
          blurContent={blurContent}
        />
      )}
    </div>
  );
}
