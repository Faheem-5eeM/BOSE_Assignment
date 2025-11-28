"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function Meteors({ number = 20, className }) {
  const [meteorStyles, setMeteorStyles] = useState([])

  useEffect(() => {
    const styles = [...Array(number)].map((_, idx) => ({
      id: idx,
      top: Math.random() * 100 + "%",
      left: Math.random() * 100 + "%",
      animationDelay: Math.random() * 2 + "s",
      animationDuration: Math.floor(Math.random() * 3 + 2) + "s",
    }))
    setMeteorStyles(styles)
  }, [number])

  return (
    <>
      {meteorStyles.map((style) => (
        <span
          key={style.id}
          className={cn(
            "pointer-events-none absolute h-0.5 w-0.5 rotate-[215deg] rounded-full",
            "bg-slate-500 dark:bg-slate-300",
            "shadow-[0_0_0_1px_#ffffff20]",
            "before:absolute before:top-1/2 before:h-px before:w-[50px] before:-translate-y-1/2",
            "before:bg-gradient-to-r before:from-slate-500 dark:before:from-slate-300 before:to-transparent",
            "before:content-['']",
            "animate-meteor",
            className,
          )}
          style={{
            top: style.top,
            left: style.left,
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration,
          }}
        />
      ))}
    </>
  )
}
