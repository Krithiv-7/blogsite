
import type { LucideIcon } from 'lucide-react';

export type BlogTopic = 'tech' | 'classic' | 'food' | 'health' | 'travel' | 'cooking' | 'guides' | 'mature';

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // Keep as string for simplicity, format on display
  excerpt: string;
  content: string; // Full markdown or HTML content
  topic: BlogTopic; // Make topic required
  tags: string[]; // Make tags required

  // Optional fields
  author?: string;
  imageUrl?: string; // Keep as optional URL string
  imageFile?: File | null; // Optional File object for upload
  imageAlt?: string;
}


export interface TopicConfig {
    label: string;
    icon: LucideIcon;
    className: string; // Class to apply to body/container
    primaryHue?: number; // Optional HSL hue for theme customization
}
