// src/app/admin/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { createPost, updatePost, deletePost } from '@/lib/posts'; // Your data functions
import type { BlogPost } from '@/types';
import { z } from 'zod';

// Define Zod schema for input validation (matching the form)
const postActionSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(10).max(200),
  content: z.string().min(20),
  author: z.string().optional(),
  tags: z.string().optional(), // Comma-separated string
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageAlt: z.string().optional(),
});

// Helper to process tags string into array
const processTags = (tagsString?: string): string[] | undefined => {
   return tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : undefined;
}

// Action to create a new post
export async function createPostAction(formData: unknown): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  // Validate input
  const validatedFields = postActionSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
    return { success: false, error: "Invalid input data. " + validatedFields.error.flatten().fieldErrors };
  }

  const { tags, ...rest } = validatedFields.data;
  const postData = {
      ...rest,
      tags: processTags(tags),
  };


  try {
    const newPost = await createPost(postData); // Call your data layer function
    revalidatePath('/'); // Revalidate homepage
    revalidatePath('/admin'); // Revalidate admin page
    revalidatePath(`/posts/${newPost.slug}`); // Revalidate the new post page
    return { success: true, post: newPost };
  } catch (error: any) {
    console.error('Create Post Error:', error);
    return { success: false, error: error.message || 'Database error: Failed to create post.' };
  }
}

// Action to update an existing post
export async function updatePostAction(slug: string, formData: unknown): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
   // Validate input
  const validatedFields = postActionSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
     return { success: false, error: "Invalid input data. " + JSON.stringify(validatedFields.error.flatten().fieldErrors) };
  }

   const { tags, ...rest } = validatedFields.data;
   const postData = {
      ...rest,
      tags: processTags(tags),
   };

  try {
    const updatedPost = await updatePost(slug, postData); // Call your data layer function
    if (!updatedPost) {
      return { success: false, error: 'Post not found.' };
    }
    revalidatePath('/'); // Revalidate homepage
    revalidatePath('/admin'); // Revalidate admin page
    revalidatePath(`/posts/${slug}`); // Revalidate the updated post page
    return { success: true, post: updatedPost };
  } catch (error: any) {
     console.error('Update Post Error:', error);
    return { success: false, error: error.message || 'Database error: Failed to update post.' };
  }
}

// Action to delete a post
export async function deletePostAction(slug: string): Promise<{ success: boolean; error?: string }> {
  if (!slug) {
     return { success: false, error: 'Invalid slug provided.' };
  }

  try {
    const success = await deletePost(slug); // Call your data layer function
    if (!success) {
      return { success: false, error: 'Post not found or already deleted.' };
    }
    revalidatePath('/'); // Revalidate homepage
    revalidatePath('/admin'); // Revalidate admin page
    // No need to revalidate the specific post page as it's gone
    return { success: true };
  } catch (error: any) {
     console.error('Delete Post Error:', error);
    return { success: false, error: error.message || 'Database error: Failed to delete post.' };
  }
}
