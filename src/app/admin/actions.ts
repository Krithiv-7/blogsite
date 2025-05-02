
// src/app/admin/actions.ts
"use server";

import { revalidatePath } from 'next/cache';
import { createPost, updatePost, deletePost } from '@/lib/posts'; // Your data functions
import type { BlogPost, BlogTopic } from '@/types';
import { z } from 'zod';
import { ALL_TOPICS } from '@/lib/topics';
import { getAuthenticatedUser } from '@/lib/auth/server-actions-auth'; // Helper to get user server-side

// Define Zod schema for input validation (matching the form)
const postActionSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(10).max(200),
  content: z.string().min(20),
  topic: z.enum(ALL_TOPICS, { required_error: "Topic is required." }),
  tags: z.string().min(1, { message: "At least one tag is required." }),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imageFile: z.custom<File | null>().optional(),
  imageAlt: z.string().optional(),
}).refine(data => !!data.imageUrl || !!data.imageFile, {
    message: "Either an Image URL or an uploaded image is required.",
    path: ["imageFile"],
}).refine(data => !(data.imageUrl && data.imageFile), {
    message: "Provide either an Image URL or upload an image, not both.",
    path: ["imageFile"],
}).refine(data => (data.imageUrl || data.imageFile) ? !!data.imageAlt : true, {
    message: "Image Alt Text is required if an image is provided.",
    path: ["imageAlt"],
});


// Helper to process tags string into array
const processTags = (tagsString: string): string[] => {
   return tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
}

// Placeholder for file upload logic (replace with actual storage solution like Firebase Storage)
async function handleImageUpload(imageFile: File | null | undefined): Promise<string | undefined> {
    if (!imageFile) return undefined;

    console.log(`Simulating upload for: ${imageFile.name}, size: ${imageFile.size}, type: ${imageFile.type}`);
    // In a real app:
    // 1. Use Firebase Admin SDK (server-side) or Client SDK (if suitable) to interact with Firebase Storage.
    // 2. Connect to your storage service (e.g., Firebase Storage)
    // 3. Generate a unique filename (e.g., using user ID and timestamp)
    // 4. Upload the file buffer/stream
    // 5. Get the public URL of the uploaded file
    // Example (conceptual):
    // const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}-${imageFile.name}`);
    // const uploadTask = uploadBytesResumable(storageRef, imageFile);
    // await uploadTask;
    // const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    // return downloadURL;

    // For now, return a placeholder URL based on the file name (NOT FOR PRODUCTION)
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload delay
    const placeholderUrl = `https://picsum.photos/seed/${encodeURIComponent(imageFile.name)}/800/400`; // Using Picsum as placeholder
    console.log(`Simulated upload complete. Placeholder URL: ${placeholderUrl}`);
    return placeholderUrl;
}


// Action to create a new post
export async function createPostAction(formData: unknown): Promise<{ success: boolean; post?: BlogPost; error?: string | object }> {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { success: false, error: 'Authentication required.' };
  }

  const validatedFields = postActionSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
    return { success: false, error: validatedFields.error.flatten().fieldErrors };
  }

  const { tags, imageFile, imageUrl: inputImageUrl, ...rest } = validatedFields.data;

  try {
    const uploadedImageUrl = await handleImageUpload(imageFile);
    const finalImageUrl = uploadedImageUrl || inputImageUrl || undefined;

    if (!finalImageUrl) {
       return { success: false, error: { imageFile: ["An image is required."] } };
    }

    const postData: Omit<BlogPost, 'slug' | 'date'> = {
        ...rest,
        authorUid: user.uid, // Set author UID from authenticated user
        authorUsername: user.username || 'Unknown User', // Set username from authenticated user
        tags: processTags(tags),
        imageUrl: finalImageUrl,
        imageAlt: rest.imageAlt || '',
        // topic is already validated and present in 'rest'
    };

    const newPost = await createPost(postData);
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/posts/${newPost.slug}`);
    return { success: true, post: newPost };
  } catch (error: any) {
    console.error('Create Post Error:', error);
    if (error.message.includes("Validation")) {
         return { success: false, error: JSON.parse(error.message) };
    }
    return { success: false, error: error.message || 'Database error: Failed to create post.' };
  }
}

// Action to update an existing post
export async function updatePostAction(slug: string, formData: unknown): Promise<{ success: boolean; post?: BlogPost; error?: string | object }> {
   const user = await getAuthenticatedUser();
   if (!user) {
     return { success: false, error: 'Authentication required.' };
   }

   // Optional: Fetch post first to check ownership if needed
   // const existingPost = await getPostBySlug(slug);
   // if (existingPost && existingPost.authorUid !== user.uid) {
   //    return { success: false, error: 'You do not have permission to edit this post.' };
   // }

   const validatedFields = postActionSchema.safeParse(formData);

   if (!validatedFields.success) {
     console.error('Update Validation Error:', validatedFields.error.flatten().fieldErrors);
     return { success: false, error: validatedFields.error.flatten().fieldErrors };
   }

   const { tags, imageFile, imageUrl: inputImageUrl, ...rest } = validatedFields.data;

  try {
    const uploadedImageUrl = await handleImageUpload(imageFile);
    // Use existing image URL if no new image provided or uploaded
    const finalImageUrl = uploadedImageUrl || inputImageUrl || undefined; // Add logic to fetch existing URL if needed


    if (!finalImageUrl) {
      // If updating, we might need to fetch the existing post's URL if neither new URL nor file is provided
      // This assumes the form logic correctly handles showing the existing image
      // For now, we'll require an image source during update as well based on current schema
       return { success: false, error: { imageFile: ["An image is required."] } };
    }


    // Prepare update data - only include fields that are part of the form schema
    const updateData: Partial<Omit<BlogPost, 'slug' | 'date' | 'authorUid' | 'authorUsername'>> = {
        title: rest.title,
        excerpt: rest.excerpt,
        content: rest.content,
        topic: rest.topic,
        tags: processTags(tags),
        imageUrl: finalImageUrl,
        imageAlt: rest.imageAlt || '',
    };

    // Pass only the updateData to the update function
    const updatedPost = await updatePost(slug, updateData);
    if (!updatedPost) {
      return { success: false, error: 'Post not found or update failed.' };
    }
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/posts/${slug}`);
    return { success: true, post: updatedPost };
  } catch (error: any)     console.error('Update Post Error:', error);
      if (error.message.includes("Validation")) {
         return { success: false, error: JSON.parse(error.message) };
      }
    return { success: false, error: error.message || 'Database error: Failed to update post.' };
  }
}

// Action to delete a post
export async function deletePostAction(slug: string): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthenticatedUser();
   if (!user) {
     return { success: false, error: 'Authentication required.' };
   }

  if (!slug) {
     return { success: false, error: 'Invalid slug provided.' };
  }

   // Optional: Add permission check - ensure the current user owns this post
   // const post = await getPostBySlug(slug);
   // if (!post) {
   //    return { success: false, error: 'Post not found.' };
   // }
   // if (post.authorUid !== user.uid) {
   //    return { success: false, error: 'You do not have permission to delete this post.' };
   // }

   // Optional: Delete associated image from storage
   // if (post?.imageUrl && post.imageUrl.startsWith('https://firebasestorage.googleapis.com/')) { // Check if it's a Firebase Storage URL
   //    await deleteImageFromFirebaseStorage(post.imageUrl); // Implement this function using Admin SDK
   // }


  try {
    const success = await deletePost(slug); // Call your data layer function
    if (!success) {
      return { success: false, error: 'Post not found or already deleted.' };
    }
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
     console.error('Delete Post Error:', error);
    return { success: false, error: error.message || 'Database error: Failed to delete post.' };
  }
}
