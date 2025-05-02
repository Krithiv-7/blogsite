
"use client"

import * as React from "react"
import { Moon, Sun, Monitor, AlertTriangle as AlertIcon } from "lucide-react" // Keep system icons, add AlertTriangle
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
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
  const [pendingTopic, setPendingTopic] = React.useState<BlogTopic | null>(null); // Store topic pending confirmation
  const [showMatureConfirm, setShowMatureConfirm] = React.useState(false); // State for AlertDialog

  // Effect to sync activeTopic with body class
  React.useEffect(() => {
    const body = document.body;

    const updateActiveTopicFromClass = () => {
       let currentTopic: BlogTopic = 'tech'; // Default
        for (const [key, config] of Object.entries(TOPICS)) {
           if (config.className && body.classList.contains(config.className)) {
               currentTopic = key as BlogTopic;
               break;
           }
        }
        setActiveTopic(currentTopic);
    }

    // Initial check
    updateActiveTopicFromClass();

    const observer = new MutationObserver((mutations) => {
         for (const mutation of mutations) {
            if (mutation.attributeName === 'class') {
                 updateActiveTopicFromClass();
                 break;
            }
         }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Ensure component is mounted
    setMounted(true);

    return () => observer.disconnect();
  }, []);


  const applyThemeClass = (topicKey: BlogTopic) => {
    const body = document.body;
    // Remove all existing theme classes
    Object.values(TOPICS).forEach(config => {
      if (config.className) {
        body.classList.remove(config.className);
      }
    });

    // Add the new theme class
    const newTopicConfig = TOPICS[topicKey];
    if (newTopicConfig?.className) {
      body.classList.add(newTopicConfig.className);
    }
     setActiveTopic(topicKey); // Update state after applying class
     // Closing the dialog happens in the action handlers
  }

  const handleTopicChange = (value: string) => {
    const newTopicKey = value as BlogTopic;
    if (newTopicKey === activeTopic) return; // No change

    if (newTopicKey === 'mature') {
        setPendingTopic(newTopicKey); // Store 'mature' as pending
        setShowMatureConfirm(true); // Open the dialog
    } else {
        applyThemeClass(newTopicKey); // Apply other themes directly
    }
  };

  const confirmMatureTheme = () => {
      if (pendingTopic === 'mature') {
          applyThemeClass('mature');
      }
      setShowMatureConfirm(false);
      setPendingTopic(null);
  }

  const cancelMatureTheme = () => {
        setShowMatureConfirm(false);
        setPendingTopic(null);
        // Revert the radio group selection visually if needed,
        // though the actual class hasn't changed yet.
        // The value prop of DropdownMenuRadioGroup should handle this.
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const CurrentTopicIcon = TOPICS[activeTopic]?.icon || Monitor; // Fallback icon

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title={`Change Style (Current: ${TOPICS[activeTopic]?.label})`}>
            {/* Display icon of the currently active topic */}
            <CurrentTopicIcon className="h-[1.2rem] w-[1.2rem] transition-all" />
            <span className="sr-only">Toggle theme style</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

          {/* Optional: Keep light/dark/system controls if desired */}
           {/* <DropdownMenuSeparator />
           <DropdownMenuLabel>Appearance</DropdownMenuLabel>
           <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" /> Light
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("dark")}>
             <Moon className="mr-2 h-4 w-4" /> Dark
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("system")}>
             <Monitor className="mr-2 h-4 w-4" /> System
           </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mature Content Confirmation Dialog */}
      <AlertDialog open={showMatureConfirm} onOpenChange={setShowMatureConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertIcon className="h-5 w-5 text-destructive" />
                Mature Content Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              The &quot;Mature&quot; style filters posts that may contain sensitive or adult themes. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelMatureTheme}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMatureTheme}>Proceed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
