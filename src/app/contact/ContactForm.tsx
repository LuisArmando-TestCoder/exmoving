'use client';

import { useState } from "react";
import { sendEmail } from "@/app/actions";
import { motion, Variants } from "framer-motion";
import { User, Mail, Target, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import styles from "@/components/ModernPage.module.scss";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  focus: z.string().min(2, "Focus area is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrors({});
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      focus: formData.get("focus") as string,
      message: formData.get("message") as string,
    };

    const validationResult = contactSchema.safeParse(rawData);

    if (!validationResult.success) {
      const formErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((err: z.ZodIssue) => {
        if (err.path[0]) {
          formErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const data = validationResult.data;

    try {
      await sendEmail({
        to: "info@aiexecutions.com",
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
    } catch (error: unknown) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to send message. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.form
      className="space-y-8"
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-100px" }}
    >
      <motion.div variants={itemVariants} className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          <User size={16} style={{ display: "inline", marginRight: "8px" }} /> Full Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className={styles.input}
          placeholder="John Doe"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="name-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ff4d4d", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            <AlertCircle size={14} /> {errors.name}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          <Mail size={16} style={{ display: "inline", marginRight: "8px" }} /> Corporate Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className={styles.input}
          placeholder="john@company.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="email-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ff4d4d", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            <AlertCircle size={14} /> {errors.email}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className={styles.formGroup}>
        <label htmlFor="focus" className={styles.label}>
          <Target size={16} style={{ display: "inline", marginRight: "8px" }} /> System Focus
        </label>
        <input
          id="focus"
          type="text"
          name="focus"
          className={styles.input}
          placeholder="e.g. Logistics, Margin Optimization"
          aria-invalid={!!errors.focus}
          aria-describedby={errors.focus ? "focus-error" : undefined}
        />
        {errors.focus && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="focus-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ff4d4d", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            <AlertCircle size={14} /> {errors.focus}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className={styles.formGroup}>
        <label htmlFor="message" className={styles.label}>
          <MessageSquare size={16} style={{ display: "inline", marginRight: "8px" }} /> Message
        </label>
        <textarea
          id="message"
          name="message"
          className={styles.textarea}
          placeholder="Describe your operational friction..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        ></textarea>
        {errors.message && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="message-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1" style={{ color: "#ff4d4d", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            <AlertCircle size={14} /> {errors.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        {status === "success" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--accent)", marginBottom: "1rem" }} className="flex items-center gap-2">
            <CheckCircle2 size={20} /> Message sent successfully!
          </motion.p>
        )}
        
        {status === "error" && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#ff4d4d", marginBottom: "1rem" }} className="flex items-center gap-2">
            <AlertCircle size={20} /> {errorMessage}
          </motion.p>
        )}

        <motion.button
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%" }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Initializing...
            </>
          ) : (
            <>
              Initialize Connection
              <Send size={18} />
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
