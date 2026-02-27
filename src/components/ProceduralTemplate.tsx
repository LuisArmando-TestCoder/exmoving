"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { navigationData, NavItem } from "@/constants/navigation";
import { usePathname } from "next/navigation";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import styles from "./ProceduralTemplate.module.scss";

import BackgroundDecor from "./procedural/BackgroundDecor";
import NotFound from "./procedural/NotFound";
import ProceduralHeader from "./procedural/ProceduralHeader";
import InteractiveExplorer from "./procedural/InteractiveExplorer";
import ValueProposition from "./procedural/ValueProposition";
import { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

function findNavItemByPath(items: NavItem[], path: string): NavItem | null {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = findNavItemByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
}

interface ProceduralTemplateProps {
  children?: ReactNode;
}

export default function ProceduralTemplate({ children }: ProceduralTemplateProps) {
  const pathname = usePathname();
  const item = findNavItemByPath(navigationData, pathname);

  if (!item) {
    return <NotFound />;
  }

  return (
    <div className={`${styles.proceduralTemplate} selection:bg-blue-500/30`}>
      <Header />
      <BackgroundDecor />

      <main className={`${styles.main} container mx-auto px-4`}>
        <Reveal direction="down" distance={20}>
          <ProceduralHeader title={item.name} />
        </Reveal>
        
        <Reveal delay={0.2} distance={10}>
          <Breadcrumbs />
        </Reveal>

        <section className="relative z-10">
          {children}
        </section>

        {item.children && item.children.length > 0 && (
          <Reveal delay={0.3}>
            <InteractiveExplorer 
              itemName={item.name} 
              childrenNodes={item.children} 
            />
          </Reveal>
        )}

        <Reveal delay={0.4}>
          <ValueProposition itemName={item.name} />
        </Reveal>
      </main>
      
      <Footer />
    </div>
  );
}
