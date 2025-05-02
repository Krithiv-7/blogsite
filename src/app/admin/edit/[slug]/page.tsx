"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PostForm } from '../../_components/post-form';
import { getPostBySlug } from '@/lib/posts'; // Use the existing function (adjust if needed for client-side)
import { updatePostAction } from '../../actions'; // We will create this action
import type { BlogPost } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slug = params.slug;

  useEffect(() => {
    async function fetchPost() {
      setIsLoading(true);
      try {
        // Note: In a real app, you might fetch this client-side via an API route
        // or ensure getPostBySlug can run client-side if needed.
        // For this example, we'll assume getPostBySlug works conceptually.
        // A better approach might be a server component fetching data and passing to client component.
        // Or, use a dedicated API route. This example uses a simplified direct call.
        const fetchedPost = await getPostBySlug(slug); // This might need adjustment for client-side use
        if (!fetchedPost) {
           toast({ title: "Error", description: "Post not found.", variant: "destructive" });
           router.push('/admin');
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
  }, [slug, router, toast]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
       const result = await updatePostAction(slug, values);
       if (result.success && result.post) {
          toast({
            title: "Post Updated",
            description: `"${result.post.title}" has been successfully updated.`,
          });
          router.push('/admin');
          router.refresh(); // Refresh server components
       } else {
          throw new Error(result.error || 'Failed to update post');
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

  if (isLoading) {
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

  if (!post) {
    // Should have been redirected, but as a fallback
    return <p className="text-center text-destructive">Post not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PostForm initialData={post} onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="edit" />
    </div>
  );
}
