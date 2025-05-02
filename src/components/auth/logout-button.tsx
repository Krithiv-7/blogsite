
"use client";

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Import useRouter

export function LogoutButton() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
       router.push('/'); // Redirect to homepage after logout
       router.refresh(); // Optional: force refresh if needed
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout Error',
        description: error.message || 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} title="Log Out">
      <LogOut className="mr-1 h-4 w-4 sm:mr-2" />
      <span className="hidden sm:inline">Log Out</span>
      <span className="sr-only">Log Out</span>
    </Button>
  );
}
