"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion"
import { Download, Github, Users } from "lucide-react"
import Navbar from "@/components/homepage/navbar"
import Footer from "@/components/homepage/footer"
import { cn } from "@/lib/utils"

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

function AnimatedNumber({
  value,
  label,
  icon: Icon,
  index,
}: {
  value: number
  label: string
  icon: typeof Download
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { stiffness: 60, damping: 18 })
  const rounded = useTransform(spring, (v) => Math.floor(v))
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => motionValue.set(value), shouldReduceMotion ? 0 : 150)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, motionValue, shouldReduceMotion])

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 32, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: index * 0.08 }}
      className="group relative flex flex-col items-center px-8 py-10 w-full sm:w-[240px]"
    >
      <div
        className={cn(
          "absolute inset-0 rounded-2xl border",
          "transition-[transform,_background-color,_border-color] duration-200 ease-out",
          "bg-background/40 backdrop-blur-xl",
          "border-border/40",
          "group-hover:border-border/70 group-hover:bg-background/60 group-hover:-translate-y-0.5",
          "group-active:scale-[0.98]",
        )}
      />
      <div
        className={cn(
          "absolute inset-0 rounded-2xl",
          "transition-opacity duration-200 ease-out",
          "opacity-0 bg-gradient-to-b from-primary/[0.03] to-transparent",
          "group-hover:opacity-100",
        )}
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: EASE_OUT, delay: index * 0.08 + 0.15 }}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-background/50 transition-colors duration-200 ease-out group-hover:border-primary/20 group-hover:bg-primary/[0.05]"
        >
          <Icon className="h-4 w-4 text-muted-foreground/70 transition-colors duration-200 ease-out group-hover:text-primary/70" />
        </motion.div>

        <div className="text-center">
          <div className="font-mono text-[56px] md:text-[72px] font-bold tracking-tighter leading-none text-foreground">
            <motion.span>{rounded}</motion.span>
          </div>
          <p className="font-mono text-[11px] text-muted-foreground/50 uppercase tracking-[0.18em] mt-3">
            {label}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "absolute right-0 top-1/2 hidden sm:block",
          "h-8 w-px bg-border/40",
          "last:hidden",
        )}
      />
    </motion.div>
  )
}

export default function StatsDisplay({
  stats,
}: {
  stats: { users: number; downloads: number; stars: number }
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <main className="min-h-screen bg-background dark relative flex flex-col">
      <div className="fixed top-0 left-0 w-px h-full bg-border/50" />
      <div className="fixed top-0 right-0 w-px h-full bg-border/50" />

      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32 mb-20 mt-20">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="text-center mb-5"
        >
          <span className="inline-flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-[0.15em]">
            <span className="h-3 w-3 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </span>
            $ supercode/stats
          </span>
        </motion.div>

        <motion.h1
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.08 }}
          className="text-[28px] md:text-[40px] font-semibold tracking-tight text-center mb-14"
        >
          Growth so far
        </motion.h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-24">
          <AnimatedNumber value={stats.downloads} label="npm downloads" icon={Download} index={0} />
          <AnimatedNumber value={stats.stars} label="github stars" icon={Github} index={1} />
          <AnimatedNumber value={stats.users} label="total users" icon={Users} index={2} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
