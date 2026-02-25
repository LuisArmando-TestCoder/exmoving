import Link from "next/link";
import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-8">Page not found in the roadmap.</p>
        <Link href="/" className={`${styles.btn} ${styles.btnPrimary}`}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
