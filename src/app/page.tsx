import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Architecture from "@/components/sections/Architecture";
import MarginEngine from "@/components/sections/MarginEngine";
import Risk from "@/components/sections/Risk";
import CopySection from "@/components/sections/CopySection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Architecture />
        <MarginEngine />
        <Risk />
        <CopySection />
      </main>
      <Footer />
    </>
  );
}
