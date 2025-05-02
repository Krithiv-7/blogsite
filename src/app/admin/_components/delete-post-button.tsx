
// src/app/admin/_components/delete-post-button.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { deletePostAction } from '../actions';
// Optional: Import useAuth if you want client-side ownership check (less secure than server-side)
// import { useAuth } from '@/context/auth-context';

interface DeletePostButtonProps {
  slug: string;
  title: string;
  // Optional: Pass authorUid if available for client-side check
  // authorUid?: string;
}

export default function DeletePostButton({ slug, title /*, authorUid */ }: DeletePostButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  // Optional: const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    // Optional Client-Side Check (less secure, server action is the source of truth)
    // if (authorUid && user?.uid !== authorUid) {
    //   toast({ title: "Forbidden", description: "You cannot delete this post.", variant: "destructive" });
    //   setIsOpen(false);
    //   return;
    // }

    setIsDeleting(true);
    try {
      const result = await deletePostAction(slug); // Server action handles auth check
      if (result.success) {
          toast({
            title: "Post Deleted",
            description: `"${title}" has been successfully deleted.`,
          });
          setIsOpen(false); // Close the dialog
          // Refresh the page or specific data without a full reload
          router.refresh(); // Refresh the admin list
      } else {
         throw new Error(result.error || 'Failed to delete post');
      }
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      toast({
        title: "Error",
        description: error.message || "Could not delete the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
         {/* Optional: Disable button if client-side check fails */}
        <Button variant="destructive" size="icon" title="Delete Post" disabled={isDeleting /* || (authorUid && user?.uid !== authorUid) */}>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          <span className="sr-only">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the post
            <strong className="mx-1">{`"${title}"`}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
             onClick={handleDelete}
             disabled={isDeleting}
             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              'Yes, delete post'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
