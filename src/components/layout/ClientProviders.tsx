"use client";

import React, { useState } from 'react';
import { EmailModal } from "@/components/ui/EmailModal";
import { ChatbotModal } from "@/components/ui/ChatbotModal";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Captcha } from "@/components/ui/Captcha";
import { NewsletterModal } from "@/components/ui/NewsletterModal";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <SmoothScroll>
      <div className="bg-glow" />
      <div className="grid-overlay" />
      
      {!isVerified && (
        <Captcha onResolve={() => setIsVerified(true)} id="global-lock" />
      )}
      
      {isVerified && (
        <>
          {children}
          <EmailModal />
          <ChatbotModal />
          <NewsletterModal />
        </>
      )}
    </SmoothScroll>
  );
}
