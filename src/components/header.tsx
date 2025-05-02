import Link from 'next/link';
import { BookOpenText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold">Blogify</span>
        </Link>
        <nav>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
