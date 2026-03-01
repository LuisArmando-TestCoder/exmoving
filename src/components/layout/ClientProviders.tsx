"use client";

import React, { useState } from 'react';
import { EmailModal } from "@/components/ui/EmailModal";
import { ChatbotModal } from "@/components/ui/ChatbotModal";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { NewsletterModal } from "@/components/ui/NewsletterModal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <div className="bg-glow" />
      <div className="grid-overlay" />

      {children}
      <EmailModal />
      <ChatbotModal />
      <NewsletterModal />
    </SmoothScroll>
  );
}
