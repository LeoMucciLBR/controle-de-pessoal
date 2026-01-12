"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className="fixed top-4 right-4 z-[9999] pointer-events-auto"
    >
        
    </div>
  )
}
