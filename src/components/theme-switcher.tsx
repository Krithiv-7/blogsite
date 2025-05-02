
"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react" // Keep system icons for internal theme setting
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, // Keep for light/dark/system
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { TOPICS, getTopicFromClassName, getTopicInfo, ALL_TOPICS } from "@/lib/topics"; // Import from central lib
import type { BlogTopic } from "@/types";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [activeTopic, setActiveTopic] = React.useState<BlogTopic>('tech'); // Default topic

  // Effect to sync activeTopic with body class and apply theme classes
  React.useEffect(() => {
    const body = document.body;

    // Function to determine topic from classes
    const updateActiveTopicFromClass = () => {
       let currentTopic: BlogTopic = 'tech'; // Default
        for (const [key, config] of Object.entries(TOPICS)) {
           if (config.className && body.classList.contains(config.className)) {
               currentTopic = key as BlogTopic;
               break; // Found the matching topic class
           }
        }
        setActiveTopic(currentTopic);
        // Also ensure the light/dark mode matches the system/user preference
        // This might cause a flicker if not handled carefully, ThemeProvider helps
    }

    // Initial check
    updateActiveTopicFromClass();

    const observer = new MutationObserver((mutations) => {
         for (const mutation of mutations) {
            if (mutation.attributeName === 'class') {
                 updateActiveTopicFromClass();
                 break; // Only need to update once per mutation batch
            }
         }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Ensure component is mounted before rendering theme-dependent UI
    setMounted(true);

    return () => observer.disconnect();
  }, []); // Run only once on mount


  const handleTopicChange = (value: string) => {
    const newTopicKey = value as BlogTopic;
    const body = document.body;

    // Remove all existing theme classes before adding the new one
    Object.values(TOPICS).forEach(config => {
      if (config.className) {
        body.classList.remove(config.className);
      }
    });

    // Add the new theme class
    const newTopicConfig = TOPICS[newTopicKey];
    if (newTopicConfig?.className) {
      body.classList.add(newTopicConfig.className);
    }
    // setActiveTopic(newTopicKey); // State update will be handled by the mutation observer
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const CurrentTopicIcon = TOPICS[activeTopic]?.icon || Monitor; // Fallback icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={`Change Style (Current: ${TOPICS[activeTopic]?.label})`}>
          {/* Display icon of the currently active topic */}
          <CurrentTopicIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
          <span className="sr-only">Toggle theme style</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
         {/* Keep light/dark/system options internally */}
         {/* <DropdownMenuLabel>Appearance</DropdownMenuLabel>
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
         <DropdownMenuSeparator /> */}

         <DropdownMenuLabel>Select Style (Filters Posts)</DropdownMenuLabel>
         <DropdownMenuRadioGroup value={activeTopic} onValueChange={handleTopicChange}>
          {ALL_TOPICS.map((topicKey) => {
            const topicInfo = getTopicInfo(topicKey);
            return topicInfo ? (
             <DropdownMenuRadioItem key={topicKey} value={topicKey}>
                <topicInfo.icon className="mr-2 h-4 w-4" />
                <span>{topicInfo.label}</span>
             </DropdownMenuRadioItem>
            ) : null;
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
