
// src/app/admin/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { createPost, updatePost, deletePost } from '@/lib/posts'; // Your data functions
import type { BlogPost, BlogTopic } from '@/types';
import { z } from 'zod';
import { ALL_TOPICS } from '@/lib/topics'; // Import topic list for validation

// Define Zod schema for input validation (matching the form)
const postActionSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(10).max(200),
  content: z.string().min(20),
  topic: z.enum(ALL_TOPICS, { required_error: "Topic is required." }), // Topic is required and includes 'gaming'
  author: z.string().optional(), // Will be set server-side based on logged-in user
  tags: z.string().min(1, { message: "At least one tag is required." }), // Tags required (as comma-separated string initially)
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageFile: z.custom<File | null>().optional(), // Accept File object or null
  imageAlt: z.string().optional(),
}).refine(data => !!data.imageUrl || !!data.imageFile, {
    message: "Either an Image URL or an uploaded image is required.",
    path: ["imageFile"], // Attach error to imageFile for form display
}).refine(data => !(data.imageUrl && data.imageFile), {
    message: "Provide either an Image URL or upload an image, not both.",
    path: ["imageFile"],
}).refine(data => (data.imageUrl || data.imageFile) ? !!data.imageAlt : true, {
    message: "Image Alt Text is required if an image is provided.",
    path: ["imageAlt"],
});


// Helper to process tags string into array
const processTags = (tagsString: string): string[] => {
   // Now guaranteed to have a non-empty string by validation
   return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
}

// Placeholder for file upload logic (replace with actual storage solution)
async function handleImageUpload(imageFile: File | null | undefined): Promise<string | undefined> {
    if (!imageFile) return undefined;

    console.log(`Simulating upload for: ${imageFile.name}, size: ${imageFile.size}, type: ${imageFile.type}`);
    // In a real app:
    // 1. Connect to your storage service (e.g., Firebase Storage, AWS S3, Cloudinary)
    // 2. Generate a unique filename
    // 3. Upload the file buffer/stream
    // 4. Get the public URL of the uploaded file
    // Example: const imageUrl = await uploadToFirebaseStorage(imageFile);
    // return imageUrl;

    // For now, return a placeholder URL based on the file name (NOT FOR PRODUCTION)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload delay
    const placeholderUrl = `https://picsum.photos/seed/${encodeURIComponent(imageFile.name)}/800/400`; // Using Picsum as placeholder
    console.log(`Simulated upload complete. Placeholder URL: ${placeholderUrl}`);
    return placeholderUrl;
}


// Action to create a new post
export async function createPostAction(formData: unknown): Promise<{ success: boolean; post?: BlogPost; error?: string | object }> {
  // Validate input
  const validatedFields = postActionSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
    return { success: false, error: validatedFields.error.flatten().fieldErrors };
  }

  const { tags, imageFile, imageUrl: inputImageUrl, author: formAuthor, ...rest } = validatedFields.data;

   // TODO: Get author from authenticated user session
   const author = "Authenticated User"; // Replace with actual user data

  try {
    // Handle image: Upload file if present, otherwise use URL
    const uploadedImageUrl = await handleImageUpload(imageFile);
    const finalImageUrl = uploadedImageUrl || inputImageUrl || undefined; // Prioritize uploaded image

    if (!finalImageUrl) {
       // This case should ideally be caught by Zod refine, but double-check
       return { success: false, error: { imageFile: ["An image is required."] } };
    }


    const postData = {
        ...rest,
        author: author, // Set author from session/server
        tags: processTags(tags), // Process tags string into array
        imageUrl: finalImageUrl, // Use the determined image URL
        imageAlt: rest.imageAlt || '', // Ensure alt text is present if image exists
        // topic is already validated and present in 'rest'
    };

    const newPost = await createPost(postData as Omit<BlogPost, 'slug' | 'date'>); // Call your data layer function
    revalidatePath('/'); // Revalidate homepage
    revalidatePath('/admin'); // Revalidate admin page
    revalidatePath(`/posts/${newPost.slug}`); // Revalidate the new post page
    return { success: true, post: newPost };
  } catch (error: any) {
    console.error('Create Post Error:', error);
    // Check if it's a validation error from deeper layers or a generic error
    if (error.message.includes("Validation")) { // Basic check, refine as needed
         return { success: false, error: JSON.parse(error.message) };
    }
    return { success: false, error: error.message || 'Database error: Failed to create post.' };
  }
}

// Action to update an existing post
export async function updatePostAction(slug: string, formData: unknown): Promise<{ success: boolean; post?: BlogPost; error?: string | object }> {
   // Validate input
  const validatedFields = postActionSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error('Update Validation Error:', validatedFields.error.flatten().fieldErrors);
     return { success: false, error: validatedFields.error.flatten().fieldErrors };
  }

   const { tags, imageFile, imageUrl: inputImageUrl, author: formAuthor, ...rest } = validatedFields.data;

   // TODO: Get author from authenticated user session if needed for validation/logging
   // const author = "Authenticated User";

  try {
    // Handle image update
    const uploadedImageUrl = await handleImageUpload(imageFile);
    const finalImageUrl = uploadedImageUrl || inputImageUrl || undefined; // Prioritize uploaded image if a new one is provided

     if (!finalImageUrl) {
       // This case should ideally be caught by Zod refine, but double-check
       return { success: false, error: { imageFile: ["An image is required."] } };
    }

    const postData = {
        ...rest,
        tags: processTags(tags), // Process tags
        imageUrl: finalImageUrl, // Use potentially updated image URL
        imageAlt: rest.imageAlt || '',
        // author: author, // Usually author doesn't change, but update if needed
        // topic is validated and in 'rest'
    };


    const updatedPost = await updatePost(slug, postData as Partial<BlogPost>); // Call your data layer function
    if (!updatedPost) {
      return { success: false, error: 'Post not found.' };
    }
    revalidatePath('/'); // Revalidate homepage
    revalidatePath('/admin'); // Revalidate admin page
    revalidatePath(`/posts/${slug}`); // Revalidate the updated post page
    return { success: true, post: updatedPost };
  } catch (error: any) {
     console.error('Update Post Error:', error);
      if (error.message.includes("Validation")) { // Basic check, refine as needed
         return { success: false, error: JSON.parse(error.message) };
      }
    return { success: false, error: error.message || 'Database error: Failed to update post.' };
  }
}

// Action to delete a post
export async function deletePostAction(slug: string): Promise<{ success: boolean; error?: string }> {
  if (!slug) {
     return { success: false, error: 'Invalid slug provided.' };
  }

   // TODO: Add permission check - ensure the current user owns this post or has delete rights

  try {
    // Optional: Delete associated image from storage before deleting post data
    // const post = await getPostBySlug(slug); // Fetch post to get image URL if needed
    // if (post?.imageUrl) {
    //    await deleteImageFromStorage(post.imageUrl); // Implement this function
    // }

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
