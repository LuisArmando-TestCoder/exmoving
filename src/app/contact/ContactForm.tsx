'use client';

import { useState } from "react";
import { sendEmail } from "@/app/actions";
import { motion, Variants } from "framer-motion";
import { User, Mail, Target, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";

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
      validationResult.error.errors.forEach((err) => {
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
      className="flex flex-col gap-6 w-full max-w-xl mx-auto"
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.div variants={itemVariants} className="relative group">
        <label htmlFor="name" className="text-sm font-medium text-white/70 mb-1.5 block flex items-center gap-2">
          <User size={16} /> Full Name
        </label>
        <div className="relative">
          <input
            id="name"
            type="text"
            name="name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300"
            placeholder="John Doe"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
        {errors.name && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="name-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.name}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="relative group">
        <label htmlFor="email" className="text-sm font-medium text-white/70 mb-1.5 block flex items-center gap-2">
          <Mail size={16} /> Corporate Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            name="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300"
            placeholder="john@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
        {errors.email && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="email-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.email}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="relative group">
        <label htmlFor="focus" className="text-sm font-medium text-white/70 mb-1.5 block flex items-center gap-2">
          <Target size={16} /> System Focus
        </label>
        <div className="relative">
          <input
            id="focus"
            type="text"
            name="focus"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300"
            placeholder="e.g. Logistics, Margin Optimization"
            aria-invalid={!!errors.focus}
            aria-describedby={errors.focus ? "focus-error" : undefined}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
        {errors.focus && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="focus-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.focus}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="relative group">
        <label htmlFor="message" className="text-sm font-medium text-white/70 mb-1.5 block flex items-center gap-2">
          <MessageSquare size={16} /> Message
        </label>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 resize-none"
            placeholder="Describe your operational friction..."
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          ></textarea>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </div>
        {errors.message && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} id="message-error" className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
            <AlertCircle size={12} /> {errors.message}
          </motion.p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="pt-2">
        {status === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center gap-3">
            <CheckCircle2 size={20} />
            <p className="text-sm font-medium">Message sent successfully!</p>
          </motion.div>
        )}
        
        {status === "error" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{errorMessage}</p>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="w-full relative overflow-hidden bg-white text-black font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Initializing...</span>
            </>
          ) : (
            <>
              <span>Initialize Connection</span>
              <Send size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
