
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PostForm } from '../../_components/post-form';
import { getPostBySlug } from '@/lib/posts';
import { updatePostAction } from '../../actions';
import type { BlogPost } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context'; // Import useAuth

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); // Get authenticated user
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slug = params.slug;

  useEffect(() => {
    // Wait for auth state to be determined
    if (authLoading) return;

    // Redirect if not logged in
    if (!user) {
      toast({ title: "Unauthorized", description: "Please log in to edit posts.", variant: "destructive" });
      router.push('/login');
      return;
    }

    async function fetchPost() {
      setIsLoading(true);
      try {
        const fetchedPost = await getPostBySlug(slug);
        if (!fetchedPost) {
           toast({ title: "Error", description: "Post not found.", variant: "destructive" });
           router.push('/admin'); // Go back to admin list if post doesn't exist
        } else if (fetchedPost.authorUid !== user.uid) {
            // Check if the logged-in user is the author
            toast({ title: "Forbidden", description: "You don't have permission to edit this post.", variant: "destructive" });
            router.push('/admin'); // Redirect if not the author
        } else {
          setPost(fetchedPost);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        toast({ title: "Error", description: "Could not load the post.", variant: "destructive" });
        router.push('/admin');
      } finally {
         setIsLoading(false);
      }
    }
    fetchPost();
  }, [slug, router, toast, user, authLoading]); // Add user and authLoading to dependencies

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    // Ensure user is still authenticated before submitting
    if (!user) {
         toast({ title: "Unauthorized", description: "Your session may have expired. Please log in again.", variant: "destructive" });
         router.push('/login');
         setIsSubmitting(false);
         return;
    }
    try {
       const result = await updatePostAction(slug, values); // Action already verifies auth server-side
       if (result.success && result.post) {
          toast({
            title: "Post Updated",
            description: `"${result.post.title}" has been successfully updated.`,
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
               throw new Error(result.error || 'Failed to update post');
           }
       }
    } catch (error: any) {
      console.error("Failed to update post:", error);
      toast({
        title: "Error",
        description: error.message || "Could not update the post. Please try again.",
        variant: "destructive",
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  // Show loading skeleton while fetching auth or post data
  if (authLoading || isLoading) {
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

  // If loading is finished but no post (due to not found or permission error)
  if (!post) {
    // User should have been redirected, but render fallback message
    return <p className="text-center text-destructive">Could not load post for editing.</p>;
  }

  // User is authenticated, owns the post, and post data is loaded
  return (
    <div className="max-w-3xl mx-auto">
      <PostForm initialData={post} onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="edit" />
    </div>
  );
}

// Added PostFormValues type definition locally for setError usage
// This should ideally be imported if PostForm exports it, or defined sharedly.
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
