import type { Metadata } from "next";
import "@/styles/globals.scss";
import { EmailModal } from "@/components/ui/EmailModal";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

export const metadata: Metadata = {
  title: "LOGOS | Moving Logistics Control Tower",
  description: "Vertical automation agency for moving companies. We engineer structural advantage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="theme-dark">
        <SmoothScroll>
          <div className="bg-glow" />
          <div className="grid-overlay" />
          {children}
          <EmailModal />
        </SmoothScroll>
      </body>
    </html>
  );
}
