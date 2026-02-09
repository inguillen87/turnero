"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
        setTheme("light")
    } else {
        setTheme("dark")
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
          <Moon className="h-5 w-5 text-indigo-400" />
      ) : (
          <Sun className="h-5 w-5 text-amber-500" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
