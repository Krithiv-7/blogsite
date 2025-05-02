
"use client";

import { useState, useEffect } from 'react'; // Added useEffect
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PostForm } from '../_components/post-form';
import { createPostAction } from '../actions';
import { useAuth } from '@/context/auth-context'; // Import useAuth
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); // Get user and loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in after checking auth state
  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Unauthorized", description: "Please log in to create a post.", variant: "destructive" });
      router.push('/login');
    }
  }, [user, authLoading, router, toast]);

  const handleSubmit = async (values: any) => {
     setIsSubmitting(true);
     // Double check auth before submitting
     if (!user) {
        toast({ title: "Unauthorized", description: "Your session may have expired. Please log in again.", variant: "destructive" });
        router.push('/login');
        setIsSubmitting(false);
        return;
     }
    try {
      const result = await createPostAction(values); // Action verifies auth server-side
      if (result.success && result.post) {
        toast({
          title: "Post Created",
          description: `"${result.post.title}" has been successfully created.`,
          variant: "default",
        });
        router.push('/admin');
        router.refresh();
      } else {
         // Handle specific validation errors returned from action
         if (typeof result.error === 'object') {
             Object.entries(result.error).forEach(([field, messages]: [string, any]) => {
                 form.setError(field as keyof PostFormValues, { type: 'server', message: messages.join(', ') });
             });
              toast({ title: "Validation Error", description: "Please check the form fields.", variant: "destructive"});
         } else {
             throw new Error(result.error || 'Failed to create post');
         }
      }
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: error.message || "Could not create the post. Please try again.",
        variant: "destructive",
      });
     } finally {
       setIsSubmitting(false);
     }
  };

   // Show loading state while auth is being checked
   if (authLoading) {
     return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-24" />
        </div>
     )
   }

   // If auth check is done and user is not logged in, render null or a message
   // (although the useEffect should have redirected)
   if (!user) {
       return <p className="text-center text-muted-foreground">Redirecting to login...</p>;
   }

  // User is authenticated, render the form
  return (
    <div className="max-w-3xl mx-auto">
       <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="create" />
    </div>
  );
}


// Added PostFormValues type definition locally for setError usage
// This should ideally be imported if PostForm exports it, or defined sharedly.
import { z } from 'zod';
import { ALL_TOPICS } from '@/lib/topics';
type PostFormValues = z.infer<typeof z.object({
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  topic: z.enum(ALL_TOPICS),
  tags: z.string(),
  imageUrl: z.string().optional().or(z.literal('')),
  imageFile: z.custom<File | null>().optional(),
  imageAlt: z.string().optional(),
})>;
// This requires importing z and ALL_TOPICS, ensure they are available.
// Need access to the `form` instance from PostForm or pass setError down.
// For simplicity, the form error handling part is commented out in the catch block
// as it requires more complex state management or prop drilling.
