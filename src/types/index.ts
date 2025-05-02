
import type { LucideIcon } from 'lucide-react';

export type BlogTopic = 'tech' | 'classic' | 'food' | 'health' | 'travel' | 'cooking' | 'guides' | 'mature' | 'gaming'; // Added 'gaming'

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // Keep as string for simplicity, format on display
  excerpt: string;
  content: string; // Full markdown or HTML content
  topic: BlogTopic; // Make topic required
  tags: string[]; // Make tags required

  // Author info (now required)
  authorUid: string; // Firebase User ID
  authorUsername: string; // User's chosen display name

  // Optional fields
  imageUrl?: string; // Keep as optional URL string
  imageFile?: File | null; // Optional File object for upload
  imageAlt?: string;
}


export interface TopicConfig {
    label: string;
    icon: LucideIcon;
    className: string; // Class to apply to body/container
}

// Add User type for authentication context
export interface User {
  uid: string;
  email: string | null;
  username: string | null; // Changed from displayName to username
}
