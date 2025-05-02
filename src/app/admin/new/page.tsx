"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { PostForm } from '../_components/post-form';
import { createPostAction } from '../actions'; // We will create this action

export default function NewPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
     setIsSubmitting(true);
    try {
      const result = await createPostAction(values);
      if (result.success && result.post) {
        toast({
          title: "Post Created",
          description: `"${result.post.title}" has been successfully created.`,
          variant: "default",
        });
        router.push('/admin'); // Redirect to admin list after creation
        router.refresh(); // Refresh server components
      } else {
         throw new Error(result.error || 'Failed to create post');
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

  return (
    <div className="max-w-3xl mx-auto">
       <PostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} mode="create" />
    </div>
  );
}
