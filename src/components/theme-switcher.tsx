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

// Export THEME_STYLES so it can be imported elsewhere (e.g., home page)
export const THEME_STYLES = {
  tech: { label: "Tech", icon: Terminal, className: "" }, // Default, no class needed
  classic: { label: "Classic", icon: Palette, className: "theme-classic" },
  food: { label: "Food", icon: Utensils, className: "theme-food" },
};

type ThemeStyleKey = keyof typeof THEME_STYLES;

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  // State is now managed by observing body class in page.tsx or via global state management if preferred
  // const [currentStyle, setCurrentStyle] = React.useState<ThemeStyleKey>('tech'); // Default to tech

  // Effect to apply/remove theme style classes (this remains crucial)
  React.useEffect(() => {
    const body = document.body;

    // Function to determine style from classes
    const getStyleFromClasses = (): ThemeStyleKey => {
       if (body.classList.contains(THEME_STYLES.classic.className)) return 'classic';
       if (body.classList.contains(THEME_STYLES.food.className)) return 'food';
       return 'tech'; // Default
    }

    let currentStyle = getStyleFromClasses();

    const observer = new MutationObserver(() => {
        const newStyle = getStyleFromClasses();
        if (newStyle !== currentStyle) {
            // Force re-render or update state if needed elsewhere based on style change
            currentStyle = newStyle;
            // console.log("Theme style changed to:", newStyle); // For debugging
        }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Ensure component is mounted before rendering theme-dependent UI
    setMounted(true);

    return () => observer.disconnect();
  }, []); // Run only once on mount


  const handleStyleChange = (value: string) => {
    // Instead of setting local state, directly manipulate body classes
    const newStyleKey = value as ThemeStyleKey;
    const body = document.body;
    Object.values(THEME_STYLES).forEach(style => {
      if (style.className) {
        body.classList.remove(style.className);
      }
    });
    const styleClass = THEME_STYLES[newStyleKey]?.className;
    if (styleClass) {
      body.classList.add(styleClass);
    }
     // No need to call setCurrentStyle here as the effect handles the update via mutation observer
  };

  // Determine the current style based on body class for the radio group value
   const getCurrentStyleFromBody = (): ThemeStyleKey => {
      if (typeof window === 'undefined') return 'tech'; // Default server-side or before mount
      const body = document.body;
      if (body.classList.contains(THEME_STYLES.classic.className)) return 'classic';
      if (body.classList.contains(THEME_STYLES.food.className)) return 'food';
      return 'tech';
   };

   const activeStyle = mounted ? getCurrentStyleFromBody() : 'tech';


  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  // const CurrentIcon = THEME_STYLES[activeStyle]?.icon || Monitor; // Fallback icon

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
        <DropdownMenuLabel>Style (Filters Posts)</DropdownMenuLabel>
         <DropdownMenuRadioGroup value={activeStyle} onValueChange={handleStyleChange}>
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
