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

export default function ProceduralTemplate() {
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
        <ProceduralHeader title={item.name} />
        <Breadcrumbs />

        {item.children && item.children.length > 0 && (
          <InteractiveExplorer 
            itemName={item.name} 
            childrenNodes={item.children} 
          />
        )}

        <ValueProposition itemName={item.name} />
      </main>
      
      <Footer />
    </div>
  );
}
