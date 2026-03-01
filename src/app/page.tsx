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

export default function Home() {
  return (
    <>
      <div>
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
