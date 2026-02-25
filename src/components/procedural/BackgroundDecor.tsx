import styles from "./BackgroundDecor.module.scss";

export default function BackgroundDecor() {
  return (
    <div className={styles.bgDecor}>
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      <div className={styles.noise} />
    </div>
  );
}
