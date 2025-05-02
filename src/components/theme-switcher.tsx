// src/components/theme-switcher.tsx
"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette, Utensils, Terminal } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

const THEME_STYLES = {
  tech: { label: "Tech", icon: Terminal, className: "" }, // Default, no class needed
  classic: { label: "Classic", icon: Palette, className: "theme-classic" },
  food: { label: "Food", icon: Utensils, className: "theme-food" },
};

type ThemeStyleKey = keyof typeof THEME_STYLES;

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [currentStyle, setCurrentStyle] = React.useState<ThemeStyleKey>('tech'); // Default to tech

  // Effect to apply/remove theme style classes
  React.useEffect(() => {
    const body = document.body;
    // Remove existing theme classes first
    Object.values(THEME_STYLES).forEach(style => {
      if (style.className) {
        body.classList.remove(style.className);
      }
    });
    // Add the current theme class
    const styleClass = THEME_STYLES[currentStyle]?.className;
    if (styleClass) {
      body.classList.add(styleClass);
    }
  }, [currentStyle]);

  // Ensure component is mounted before rendering theme-dependent UI
  React.useEffect(() => setMounted(true), [])

  const handleStyleChange = (value: string) => {
    setCurrentStyle(value as ThemeStyleKey);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const CurrentIcon = THEME_STYLES[currentStyle]?.icon || Monitor; // Fallback icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Change Theme">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Style</DropdownMenuLabel>
         <DropdownMenuRadioGroup value={currentStyle} onValueChange={handleStyleChange}>
          {Object.entries(THEME_STYLES).map(([key, { label, icon: Icon }]) => (
             <DropdownMenuRadioItem key={key} value={key}>
                <Icon className="mr-2 h-4 w-4" />
                <span>{label}</span>
             </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
