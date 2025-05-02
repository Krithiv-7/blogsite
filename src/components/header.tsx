import Link from 'next/link';
import { BookOpenText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from './theme-switcher'; // Import the ThemeSwitcher

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold">Blogify</span>
        </Link>
        <nav className="flex items-center gap-2">
           <ThemeSwitcher /> {/* Add the ThemeSwitcher */}
           <Button variant="ghost" size="icon" asChild>
            <Link href="/admin" title="Admin Settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Admin</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
