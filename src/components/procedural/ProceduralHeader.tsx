import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import styles from "./ProceduralHeader.module.scss";

interface ProceduralHeaderProps {
  title: string;
}

export default function ProceduralHeader({ title }: ProceduralHeaderProps) {
  return (
    <div className={styles.headerSection}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={styles.badge}
      >
        <Zap size={12} className="mr-2" />
        Roadmap Component
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={styles.title}
      >
        {title}
        <span>.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={styles.description}
      >
        Deploying ROI-driven scaling solutions for {title.toLowerCase()} in industries
        technically left behind. Automating operational friction into measurable returns.
      </motion.p>
    </div>
  );
}
