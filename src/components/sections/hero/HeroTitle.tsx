"use client";

import { MotionValue } from "framer-motion";
import styles from "../Hero.module.scss";
import { TitleText } from "./TitleText";
import { SubtitleText } from "./SubtitleText";

interface HeroTitleProps {
  isInView: boolean;
  smoothXTitle: MotionValue<number>;
  smoothXSubtitle: MotionValue<number>;
  opacityContent: MotionValue<number>;
  blurContent: MotionValue<string | any>;
}

export function HeroTitle({
  isInView,
  smoothXTitle,
  smoothXSubtitle,
  opacityContent,
  blurContent,
}: HeroTitleProps) {
  return (
    <div className={styles.titleContainer} style={{ perspective: "1000px" }}>
      {isInView && (
        <>
          <TitleText 
            isInView={isInView}
            smoothXTitle={smoothXTitle}
            opacityContent={opacityContent}
            blurContent={blurContent}
          />

          <SubtitleText 
            isInView={isInView}
            smoothXSubtitle={smoothXSubtitle}
            opacityContent={opacityContent}
            blurContent={blurContent}
          />
        </>
      )}
    </div>
  );
}
