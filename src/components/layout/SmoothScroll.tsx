'use client'
import React, { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollStore } from '@/store/useScrollStore'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const setLenis = useScrollStore((state) => state.setLenis)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    setLenis(lenis)

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const update = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      setLenis(undefined)
      gsap.ticker.remove(update)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [setLenis])

  return <>{children}</>
}
