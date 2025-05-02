"use client"

import * as React from "react"
import { Moon, Sun, Monitor, AlertTriangle as AlertIcon } from "lucide-react"
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
} from "@/components/ui/alert-dialog";
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
import { TOPICS, getTopicInfo, ALL_TOPICS } from "@/lib/topics";
import type { BlogTopic } from "@/types";

const MATURE_CONSENT_KEY = "mature_content_consent";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [activeTopic, setActiveTopic] = React.useState<BlogTopic>('tech');
  const [pendingTopic, setPendingTopic] = React.useState<BlogTopic | null>(null);
  const [showMatureConfirm, setShowMatureConfirm] = React.useState(false);
  const [hasMatureConsent, setHasMatureConsent] = React.useState(false);

  // Effect to check for consent on mount and sync activeTopic with body class
  React.useEffect(() => {
    // Check localStorage for consent only on the client-side
    const consent = localStorage.getItem(MATURE_CONSENT_KEY) === 'true';
    setHasMatureConsent(consent);

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

    updateActiveTopicFromClass(); // Initial check

    const observer = new MutationObserver((mutations) => {
         for (const mutation of mutations) {
            if (mutation.attributeName === 'class') {
                 updateActiveTopicFromClass();
                 break;
            }
         }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    setMounted(true); // Indicate component is mounted

    return () => observer.disconnect();
  }, []); // Run only once on mount


  const applyThemeClass = (topicKey: BlogTopic) => {
    const body = document.body;
    Object.values(TOPICS).forEach(config => {
      if (config.className) {
        body.classList.remove(config.className);
      }
    });

    const newTopicConfig = TOPICS[topicKey];
    if (newTopicConfig?.className) {
      body.classList.add(newTopicConfig.className);
    }
    setActiveTopic(topicKey);
  }

  const handleTopicChange = (value: string) => {
    const newTopicKey = value as BlogTopic;
    if (newTopicKey === activeTopic) return;

    if (newTopicKey === 'mature' && !hasMatureConsent) {
        setPendingTopic(newTopicKey);
        setShowMatureConfirm(true);
    } else {
        applyThemeClass(newTopicKey);
    }
  };

  const confirmMatureTheme = () => {
      if (pendingTopic === 'mature') {
          applyThemeClass('mature');
          // Store consent in localStorage
          localStorage.setItem(MATURE_CONSENT_KEY, 'true');
          setHasMatureConsent(true); // Update state
      }
      setShowMatureConfirm(false);
      setPendingTopic(null);
  }

  const cancelMatureTheme = () => {
        setShowMatureConfirm(false);
        setPendingTopic(null);
        // Radio group value binding should handle visual state automatically
  }

  if (!mounted) {
    // Render a placeholder or null during server-side rendering and initial mount
    return (
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" disabled>
           <Sun className="h-[1.2rem] w-[1.2rem]" />
         </Button>
         <Button variant="ghost" size="icon" disabled>
            <Monitor className="h-[1.2rem] w-[1.2rem]" />
         </Button>
      </div>
    );
  }

  const CurrentTopicIcon = TOPICS[activeTopic]?.icon || Monitor; // Fallback icon

  return (
    <>
       <div className="flex items-center gap-1">
         {/* Light/Dark Toggle */}
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title={`Change Appearance (${theme})`}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme appearance</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" /> Light
              </DropdownMenuItem>
              {/* Removed Dark option */}
              <DropdownMenuItem onClick={() => setTheme("system")}>
                 <Monitor className="mr-2 h-4 w-4" /> System
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

        {/* Topic Style Dropdown */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title={`Change Style (Current: ${TOPICS[activeTopic]?.label})`}>
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
            </DropdownMenuContent>
        </DropdownMenu>
     </div>

      {/* Mature Content Confirmation Dialog */}
      <AlertDialog open={showMatureConfirm} onOpenChange={setShowMatureConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertIcon className="h-5 w-5 text-destructive" />
                Mature Content Warning
            </AlertDialogTitle>
            <AlertDialogDescription>
              The &quot;Mature&quot; style filters posts that may contain sensitive or adult themes. Selecting this style implies you are comfortable viewing such content. Are you sure you want to proceed?
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
