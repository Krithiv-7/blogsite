
import type { BlogPost } from '@/types';
import { ALL_TOPICS } from './topics';

// Mock data - replace with actual data fetching logic
// Add authorUid and authorUsername to all posts
export let mockPosts: BlogPost[] = [
  // --- Tech ---
  {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 15',
    date: '2024-07-26',
    excerpt: 'Learn the basics of Next.js and how to set up your first project using the App Router.',
    content: `... (content remains the same) ...`,
    authorUid: 'user1_tech', // Example UID
    authorUsername: 'Tech Guru', // Example Username
    tags: ['Next.js', 'React', 'Web Development', 'App Router'],
    imageUrl: 'https://picsum.photos/seed/nextjs15/800/400',
    imageAlt: 'Abstract code background with Next.js logo',
    topic: 'tech',
  },
  {
    slug: 'styling-in-tailwind',
    title: 'Mastering Tailwind CSS v4',
    date: '2024-07-25',
    excerpt: 'Discover the power of utility-first CSS with the latest Tailwind features.',
    content: `... (content remains the same) ...`,
    authorUid: 'user2_css',
    authorUsername: 'CSS Wizard',
    tags: ['CSS', 'Tailwind CSS', 'Styling', 'Frontend'],
    imageUrl: 'https://picsum.photos/seed/tailwind4/800/400',
    imageAlt: 'Tailwind CSS logo with code snippets',
    topic: 'tech',
  },
   // --- Classic ---
  {
    slug: 'vintage-book-binding',
    title: 'The Art of Vintage Book Binding',
    date: '2024-07-23',
    excerpt: 'Exploring the traditional techniques of classic bookbinding.',
    content: `... (content remains the same) ...`,
    authorUid: 'user3_classic',
    authorUsername: 'Edward Ledger',
    tags: ['Books', 'Craft', 'History', 'Classic', 'Binding'],
    imageUrl: 'https://picsum.photos/seed/bookbinding/800/400',
    imageAlt: 'Old books stacked with binding tools',
    topic: 'classic',
  },
  // --- Food ---
   {
    slug: 'perfect-sourdough',
    title: 'Baking the Perfect Sourdough Loaf',
    date: '2024-07-22',
    excerpt: 'A guide to achieving a tangy flavor and open crumb in your homemade sourdough.',
    content: `... (content remains the same) ...`,
    authorUid: 'user4_food',
    authorUsername: 'Olivia Baker',
    tags: ['Baking', 'Sourdough', 'Food', 'Recipe', 'Bread'],
    imageUrl: 'https://picsum.photos/seed/sourdough/800/400',
    imageAlt: 'A golden-brown sourdough loaf on a wooden board',
    topic: 'food',
  },
  // --- Health ---
  {
    slug: 'mindfulness-for-beginners',
    title: 'Mindfulness Meditation for Beginners',
    date: '2024-07-21',
    excerpt: 'Simple techniques to start practicing mindfulness and reduce stress.',
    content: `... (content) ...`,
    authorUid: 'user5_health',
    authorUsername: 'Dr. Anya Sharma',
    tags: ['Mindfulness', 'Meditation', 'Health', 'Wellbeing', 'Stress Relief'],
    imageUrl: 'https://picsum.photos/seed/mindfulness/800/400',
    imageAlt: 'Person meditating peacefully outdoors',
    topic: 'health',
  },
  // --- Travel ---
   {
    slug: 'exploring-kyoto',
    title: 'A Weekend Guide to Exploring Kyoto',
    date: '2024-07-20',
    excerpt: 'Discover the ancient temples, serene gardens, and vibrant culture of Kyoto.',
    content: `... (content) ...`,
    authorUid: 'user6_travel',
    authorUsername: 'Marco Polo Jr.',
    tags: ['Travel', 'Japan', 'Kyoto', 'Asia', 'Culture', 'Guide'],
    imageUrl: 'https://picsum.photos/seed/kyoto/800/400',
    imageAlt: 'Iconic red torii gates at Fushimi Inari Shrine in Kyoto',
    topic: 'travel',
  },
   // --- Cooking ---
  {
    slug: 'simple-pasta-aglio-olio',
    title: 'Simple & Delicious Pasta Aglio e Olio',
    date: '2024-07-19',
    excerpt: 'Master this classic Italian pasta dish with garlic, olive oil, and chili flakes.',
    content: `... (content) ...`,
    authorUid: 'user7_cooking',
    authorUsername: 'Chef Isabella Rossi',
    tags: ['Cooking', 'Recipe', 'Pasta', 'Italian', 'Quick Meal', 'Vegetarian'],
    imageUrl: 'https://picsum.photos/seed/aglioolio/800/400',
    imageAlt: 'Close-up of pasta Aglio e Olio in a pan',
    topic: 'cooking',
  },
  // --- Guides ---
  {
    slug: 'choose-right-laptop',
    title: 'How to Choose the Right Laptop in 2024',
    date: '2024-07-18',
    excerpt: 'A comprehensive guide to help you select the perfect laptop for your needs.',
    content: `... (content) ...`,
    authorUid: 'user8_guides',
    authorUsername: 'Gadget Advisor',
    tags: ['Guides', 'Technology', 'Laptops', 'Buying Guide', 'Computers'],
    imageUrl: 'https://picsum.photos/seed/laptopguide/800/400',
    imageAlt: 'Various laptops displayed on a table',
    topic: 'guides',
  },
  // --- Gaming ---
  {
    slug: 'indie-game-gems-2024',
    title: 'Must-Play Indie Game Gems of 2024',
    date: '2024-07-16',
    excerpt: 'Discover hidden indie game treasures you might have missed this year.',
    content: `... (content) ...`,
    authorUid: 'user9_gaming',
    authorUsername: 'Gamer Nexus',
    tags: ['Gaming', 'Indie Games', 'PC Gaming', 'Console Gaming', 'Review'],
    imageUrl: 'https://picsum.photos/seed/indiegames/800/400',
    imageAlt: 'Abstract pixel art landscape representing indie games',
    topic: 'gaming',
  },
   // --- Mature ---
  {
    slug: 'philosophy-of-existence',
    title: 'Exploring the Philosophy of Existence',
    date: '2024-07-17',
    excerpt: 'A brief delve into existential questions about meaning, purpose, and being.',
    content: `... (content) ...`,
    authorUid: 'user10_mature',
    authorUsername: 'Thinker Deeply',
    tags: ['Philosophy', 'Existentialism', 'Meaning', 'Mature', 'Reflection'],
    imageUrl: 'https://picsum.photos/seed/existence/800/400',
    imageAlt: 'Silhouette of a person looking at a starry night sky',
    topic: 'mature',
  },
];


// Function to get all posts (replace with actual data fetching)
export async function getAllPosts(): Promise<BlogPost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  // Ensure posts are sorted by date descending
  return [...mockPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Function to get a single post by slug (replace with actual data fetching)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  const post = mockPosts.find(p => p.slug === slug);
  return post || null;
}

// --- CRUD Operations (Maintain Placeholders - adapt for real backend) ---

// Function to generate a unique slug (basic version)
function generateSlug(title: string): string {
    let baseSlug = title.toLowerCase()
        .replace(/\s+/g, '-')          // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove invalid chars
        .replace(/--+/g, '-')          // Replace multiple - with single -
        .replace(/^-+/, '')           // Trim - from start
        .replace(/-+$/, '');          // Trim - from end

    // Check for uniqueness against existing slugs
    let slug = baseSlug;
    let counter = 1;
    while (mockPosts.some(post => post.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}


// Ensure the input type includes authorUid and authorUsername
export async function createPost(postData: Omit<BlogPost, 'slug' | 'date'>): Promise<BlogPost> {
  console.log('Attempting to create post:', postData);

  // Validation including author info
  if (!postData.title || !postData.topic || !postData.tags || postData.tags.length === 0 || !postData.excerpt || !postData.content || (!postData.imageUrl) || (!postData.imageAlt) || !postData.authorUid || !postData.authorUsername) {
     console.error("Create Post Error: Missing required fields before saving.", postData);
     throw new Error(JSON.stringify({ validation: "Internal server error: Missing required fields." }));
  }

  const newSlug = generateSlug(postData.title);

  const newPost: BlogPost = {
    slug: newSlug,
    title: postData.title,
    date: new Date().toISOString().split('T')[0], // Use current date
    excerpt: postData.excerpt,
    content: postData.content,
    topic: postData.topic,
    tags: postData.tags,
    authorUid: postData.authorUid, // Include authorUid
    authorUsername: postData.authorUsername, // Include authorUsername
    imageUrl: postData.imageUrl, // Image URL is now required (after upload/selection)
    imageAlt: postData.imageAlt, // Alt text is now required
  };

  mockPosts.unshift(newPost);
  console.log('Post created successfully:', newPost);
  return newPost;
}

// Update function needs to handle partial updates correctly
// Exclude slug, date, authorUid, authorUsername from update payload type
export async function updatePost(slug: string, postData: Partial<Omit<BlogPost, 'slug' | 'date' | 'authorUid' | 'authorUsername'>>): Promise<BlogPost | null> {
  console.log(`Attempting to update post ${slug}:`, postData);
  const index = mockPosts.findIndex(p => p.slug === slug);
  if (index === -1) {
    console.error(`Update Post Error: Post with slug "${slug}" not found.`);
    return null;
  }

  const existingPost = mockPosts[index];

   // Merge data, ensuring required fields aren't accidentally removed or changed inappropriately
   const updatedPostData: BlogPost = {
     ...existingPost, // Start with existing data
     ...postData, // Overwrite with new data from the form
     // Ensure required fields that might be in postData are correctly typed/present
     topic: postData.topic || existingPost.topic,
     tags: postData.tags || existingPost.tags,
     imageUrl: postData.imageUrl !== undefined ? postData.imageUrl : existingPost.imageUrl,
     imageAlt: postData.imageAlt !== undefined ? postData.imageAlt : existingPost.imageAlt,
     // authorUid and authorUsername should generally not be changed during an update via this action
     authorUid: existingPost.authorUid,
     authorUsername: existingPost.authorUsername,
   };

   // Re-validate essential fields after merge
   if (!updatedPostData.topic || !updatedPostData.tags || updatedPostData.tags.length === 0 || !updatedPostData.imageUrl || !updatedPostData.imageAlt || !updatedPostData.authorUid || !updatedPostData.authorUsername) {
       console.error("Update Post Error: Required fields missing after update merge.", updatedPostData);
       throw new Error(JSON.stringify({ validation: "Internal server error: Update resulted in missing required fields." }));
   }

  mockPosts[index] = updatedPostData; // Update mock data
  console.log('Post updated successfully:', updatedPostData);
  return updatedPostData;
}


export async function deletePost(slug: string): Promise<boolean> {
  console.log('Attempting to delete post:', slug);
  const initialLength = mockPosts.length;
  mockPosts = mockPosts.filter(p => p.slug !== slug); // Update mock data
  const success = mockPosts.length < initialLength;
  if (success) {
      console.log('Post deleted successfully:', slug);
  } else {
       console.error(`Delete Post Error: Post with slug "${slug}" not found.`);
  }
  return success;
}
