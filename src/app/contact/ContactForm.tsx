'use client';

import { useState } from "react";
import { sendEmail } from "@/app/actions";
import styles from "@/components/ModernPage.module.scss";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      focus: formData.get("focus") as string,
      message: formData.get("message") as string,
    };

    try {
      await sendEmail({
        to: "info@aiban.news",
        subject: `New Connection Request: ${data.focus}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nFocus: ${data.focus}\nMessage: ${data.message}`,
        html: `
          <h3>New Connection Request</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Focus:</strong> ${data.focus}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `,
      });
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Failed to send message. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Full Name</label>
        <input type="text" name="name" className={styles.input} placeholder="John Doe" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Corporate Email</label>
        <input type="email" name="email" className={styles.input} placeholder="john@company.com" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>System Focus</label>
        <input type="text" name="focus" className={styles.input} placeholder="e.g. Logistics, Margin Optimization" required />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Message</label>
        <textarea name="message" className={styles.textarea} placeholder="Describe your operational friction..." required></textarea>
      </div>
      {status === "success" && (
        <p style={{ color: "var(--accent)", marginBottom: "1rem" }}>Message sent successfully!</p>
      )}
      {status === "error" && (
        <p style={{ color: "#ff4d4d", marginBottom: "1rem" }}>{errorMessage}</p>
      )}
      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? "Initializing..." : "Initialize Connection"}
      </button>
    </form>
  );
}
