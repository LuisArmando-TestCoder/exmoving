'use client';

import React, { useState, useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Subtitles from "@/components/sections/Subtitles";
import Architecture from "@/components/sections/Architecture";
import MarginEngine from "@/components/sections/MarginEngine";
import Risk from "@/components/sections/Risk";
import CopySection from "@/components/sections/CopySection";
import { Captcha } from "@/components/ui/Captcha";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Small delay to allow captcha to check local storage
    const timer = setTimeout(() => {
      if (isVerified) {
        setShowContent(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isVerified]);

  return (
    <>
      {!isVerified && <Captcha onResolve={() => setIsVerified(true)} id="home-page" />}
      
      {/* 
        We render the layout immediately to help load assets (fonts, images, scripts),
        but keep it invisible until verified. 
      */}
      <div style={{ 
        opacity: showContent ? 1 : 0, 
        visibility: showContent ? 'visible' : 'hidden',
        transition: 'opacity 0.8s ease'
      }}>
        <Header />
        <main>
          <Hero />
          <Subtitles />
          <Architecture />
          <MarginEngine />
          <Risk />
          <CopySection />
        </main>
        <Footer />
      </div>
    </>
  );
}
