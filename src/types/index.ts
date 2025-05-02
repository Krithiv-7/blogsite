export interface BlogPost {
  slug: string;
  title: string;
  date: string; // Keep as string for simplicity, format on display
  excerpt: string;
  content: string; // Full markdown or HTML content
  // Optional fields
  author?: string;
  tags?: string[];
  imageUrl?: string;
  imageAlt?: string;
  topic?: 'tech' | 'classic' | 'food'; // Added topic field
}
