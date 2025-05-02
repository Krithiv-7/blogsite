
"use client"; // Need client component to use context hook

import Link from 'next/link';
import { BookOpenText, Settings, UserCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from './theme-switcher';
import { useAuth } from '@/context/auth-context'; // Import useAuth
import { LogoutButton } from './auth/logout-button'; // Import LogoutButton
import { Skeleton } from './ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For user avatar


export function Header() {
  const { user, loading } = useAuth(); // Get user and loading state

  const getInitials = (name: string | null | undefined) => {
      if (!name) return "?";
      const names = name.split(' ');
      let initials = names[0].substring(0, 1).toUpperCase();
      if (names.length > 1) {
          initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold transition-colors hover:text-primary">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold">Blogify</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
           <ThemeSwitcher />

           {loading ? (
             // Show skeletons while loading auth state
             <div className="flex items-center gap-2">
               <Skeleton className="h-8 w-8 rounded-full" />
               <Skeleton className="h-8 w-20 hidden sm:block" />
             </div>
           ) : user ? (
            // User is logged in
            <>
              <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex" title="Admin Dashboard">
                <Link href="/admin">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Admin</span>
                </Link>
              </Button>

              {/* User Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            {/* Add AvatarImage if you store profile pictures */}
                            {/* <AvatarImage src={user.photoURL || undefined} alt={user.username || 'User'} /> */}
                            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                         </Avatar>
                         <span className="sr-only">User Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.username || 'User'}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="sm:hidden">
                        <Link href="/admin">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    {/* Add link to Account Settings page when created */}
                    {/* <DropdownMenuItem asChild>
                        <Link href="/account">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Account</span>
                        </Link>
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <LogoutButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
             // User is logged out
             <Button variant="ghost" size="sm" asChild>
                 <Link href="/login">
                   <LogIn className="mr-1 h-4 w-4 sm:mr-2" />
                   <span className="hidden sm:inline">Login</span>
                   <span className="sr-only">Login</span>
                 </Link>
             </Button>
           )}
        </nav>
      </div>
    </header>
  );
}
