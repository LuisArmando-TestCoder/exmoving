"use client";

import { create } from "zustand";

interface DemoModalStore {
  isOpen: boolean;
  title: string;
  subject: string;
  openModal: (title?: string, subject?: string) => void;
  closeModal: () => void;
}

export const useDemoModal = create<DemoModalStore>((set) => ({
  isOpen: false,
  title: "GET YOUR FREE DEMO",
  subject: "Demo Request",
  openModal: (title = "GET YOUR FREE DEMO", subject = "Demo Request") => 
    set({ isOpen: true, title, subject }),
  closeModal: () => set({ isOpen: false }),
}));
