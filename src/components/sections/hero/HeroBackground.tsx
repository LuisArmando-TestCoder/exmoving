"use client";

import { motion, MotionValue } from "framer-motion";
import styles from "../Hero.module.scss";
import { ShaderCanvas } from "../ShaderCanvas";
import { HERO_SHADER } from "./constants";

interface HeroBackgroundProps {
  scaleVideo: MotionValue<number>;
  opacityVideo: MotionValue<number>;
  blurVideo: MotionValue<string | any>;
}

export function HeroBackground({ scaleVideo, opacityVideo, blurVideo }: HeroBackgroundProps) {
  return (
    <motion.div 
      className={styles.videoContainer}
      style={{ 
        scale: scaleVideo,
        opacity: opacityVideo,
        filter: blurVideo
      }}
    >
      <ShaderCanvas 
        shader={HERO_SHADER}
        iChannel0="https://images.pexels.com/photos/172289/pexels-photo-172289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      />
    </motion.div>
  );
}
