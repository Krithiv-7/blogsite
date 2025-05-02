
import type { BlogPost } from '@/types';
import { ALL_TOPICS } from './topics';

// Mock data - replace with actual data fetching logic
// Ensure all posts have required 'topic' and 'tags'
export let mockPosts: BlogPost[] = [
  // --- Tech ---
  {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js 15',
    date: '2024-07-26',
    excerpt: 'Learn the basics of Next.js and how to set up your first project using the App Router.',
    content: `... (content remains the same) ...`, // Keep content concise for brevity
    author: 'Tech Guru',
    tags: ['Next.js', 'React', 'Web Development', 'App Router'], // Required
    imageUrl: 'https://picsum.photos/seed/nextjs15/800/400',
    imageAlt: 'Abstract code background with Next.js logo',
    topic: 'tech', // Required
  },
  {
    slug: 'styling-in-tailwind',
    title: 'Mastering Tailwind CSS v4',
    date: '2024-07-25',
    excerpt: 'Discover the power of utility-first CSS with the latest Tailwind features.',
    content: `... (content remains the same) ...`,
    author: 'CSS Wizard',
    tags: ['CSS', 'Tailwind CSS', 'Styling', 'Frontend'], // Required
    imageUrl: 'https://picsum.photos/seed/tailwind4/800/400',
    imageAlt: 'Tailwind CSS logo with code snippets',
    topic: 'tech', // Required
  },
   // --- Classic ---
  {
    slug: 'vintage-book-binding',
    title: 'The Art of Vintage Book Binding',
    date: '2024-07-23',
    excerpt: 'Exploring the traditional techniques of classic bookbinding.',
    content: `... (content remains the same) ...`,
    author: 'Edward Ledger',
    tags: ['Books', 'Craft', 'History', 'Classic', 'Binding'], // Required
    imageUrl: 'https://picsum.photos/seed/bookbinding/800/400',
    imageAlt: 'Old books stacked with binding tools',
    topic: 'classic', // Required
  },
  // --- Food ---
   {
    slug: 'perfect-sourdough',
    title: 'Baking the Perfect Sourdough Loaf',
    date: '2024-07-22',
    excerpt: 'A guide to achieving a tangy flavor and open crumb in your homemade sourdough.',
    content: `... (content remains the same) ...`,
    author: 'Olivia Baker',
    tags: ['Baking', 'Sourdough', 'Food', 'Recipe', 'Bread'], // Required
    imageUrl: 'https://picsum.photos/seed/sourdough/800/400',
    imageAlt: 'A golden-brown sourdough loaf on a wooden board',
    topic: 'food', // Required
  },
  // --- Health ---
  {
    slug: 'mindfulness-for-beginners',
    title: 'Mindfulness Meditation for Beginners',
    date: '2024-07-21',
    excerpt: 'Simple techniques to start practicing mindfulness and reduce stress.',
    content: `
## What is Mindfulness?
Mindfulness is the practice of paying attention to the present moment without judgment. It can help reduce stress, improve focus, and enhance emotional regulation.

## Simple Exercise: Mindful Breathing
1. Find a quiet place to sit comfortably.
2. Close your eyes gently.
3. Bring your attention to your breath. Notice the sensation of air entering and leaving your body.
4. If your mind wanders, gently guide it back to your breath.
5. Start with 5 minutes daily.

Consistency is key. Even short sessions can make a difference.
    `,
    author: 'Dr. Anya Sharma',
    tags: ['Mindfulness', 'Meditation', 'Health', 'Wellbeing', 'Stress Relief'], // Required
    imageUrl: 'https://picsum.photos/seed/mindfulness/800/400',
    imageAlt: 'Person meditating peacefully outdoors',
    topic: 'health', // Required
  },
  // --- Travel ---
   {
    slug: 'exploring-kyoto',
    title: 'A Weekend Guide to Exploring Kyoto',
    date: '2024-07-20',
    excerpt: 'Discover the ancient temples, serene gardens, and vibrant culture of Kyoto.',
    content: `
## Must-Visit Spots
*   **Fushimi Inari Shrine:** Walk through thousands of vibrant red torii gates.
*   **Arashiyama Bamboo Grove:** Immerse yourself in the towering bamboo forest.
*   **Kinkaku-ji (Golden Pavilion):** Admire the stunning gold-leaf covered temple.
*   **Gion District:** Explore the traditional geisha district (be respectful).

## Tips
*   Get a Japan Rail Pass if traveling from other cities.
*   Wear comfortable shoes - you'll do a lot of walking!
*   Try local matcha tea and sweets.
    `,
    author: 'Marco Polo Jr.',
    tags: ['Travel', 'Japan', 'Kyoto', 'Asia', 'Culture', 'Guide'], // Required
    imageUrl: 'https://picsum.photos/seed/kyoto/800/400',
    imageAlt: 'Iconic red torii gates at Fushimi Inari Shrine in Kyoto',
    topic: 'travel', // Required
  },
   // --- Cooking ---
  {
    slug: 'simple-pasta-aglio-olio',
    title: 'Simple & Delicious Pasta Aglio e Olio',
    date: '2024-07-19',
    excerpt: 'Master this classic Italian pasta dish with garlic, olive oil, and chili flakes.',
    content: `
## Ingredients (Serves 2)
*   200g Spaghetti
*   4-6 cloves Garlic, thinly sliced
*   1/2 tsp Red chili flakes (or to taste)
*   1/4 cup Extra virgin olive oil
*   Salt to taste
*   Fresh parsley, chopped (optional)
*   Parmesan cheese, grated (optional)

## Instructions
1. Cook spaghetti in salted boiling water until al dente. Reserve 1/2 cup pasta water.
2. While pasta cooks, heat olive oil in a large skillet over medium-low heat. Add garlic and chili flakes. Cook gently until garlic is fragrant and lightly golden (do not burn!).
3. Drain pasta and add it directly to the skillet. Add a splash of reserved pasta water. Toss well to coat the pasta in the oil.
4. Season with salt. Add parsley and Parmesan if using. Serve immediately.
    `,
    author: 'Chef Isabella Rossi',
    tags: ['Cooking', 'Recipe', 'Pasta', 'Italian', 'Quick Meal', 'Vegetarian'], // Required
    imageUrl: 'https://picsum.photos/seed/aglioolio/800/400',
    imageAlt: 'Close-up of pasta Aglio e Olio in a pan',
    topic: 'cooking', // Required
  },
  // --- Guides ---
  {
    slug: 'choose-right-laptop',
    title: 'How to Choose the Right Laptop in 2024',
    date: '2024-07-18',
    excerpt: 'A comprehensive guide to help you select the perfect laptop for your needs.',
    content: `
## Key Considerations
1.  **Operating System:** Windows, macOS, or ChromeOS? Depends on your ecosystem and software needs.
2.  **Budget:** Determine your price range. Laptops vary significantly in cost.
3.  **Use Case:** Gaming, work, portability, creative tasks? This dictates required specs (CPU, RAM, GPU, Storage).
4.  **Screen Size & Quality:** Consider resolution, color accuracy, and brightness based on your tasks.
5.  **Portability:** Weight and battery life are crucial if you travel frequently.
6.  **Keyboard & Trackpad:** Try them out if possible, especially for extensive typing.

Research reviews and compare models within your budget and use case.
    `,
    author: 'Gadget Advisor',
    tags: ['Guides', 'Technology', 'Laptops', 'Buying Guide', 'Computers'], // Required
    imageUrl: 'https://picsum.photos/seed/laptopguide/800/400',
    imageAlt: 'Various laptops displayed on a table',
    topic: 'guides', // Required
  },
  // --- Gaming ---
  {
    slug: 'indie-game-gems-2024',
    title: 'Must-Play Indie Game Gems of 2024',
    date: '2024-07-16',
    excerpt: 'Discover hidden indie game treasures you might have missed this year.',
    content: `
## Top Picks So Far
*   **Pixel Pioneers:** A charming retro-style RPG with deep crafting.
*   **Neon Nights:** Fast-paced cyberpunk action platformer with a killer soundtrack.
*   **Whispering Woods:** A narrative-driven adventure with stunning hand-drawn art.
*   **Cosmic Cartographers:** Relaxing space exploration and trading simulator.

Support indie developers and find your next favorite game!
    `,
    author: 'Gamer Nexus',
    tags: ['Gaming', 'Indie Games', 'PC Gaming', 'Console Gaming', 'Review'], // Required
    imageUrl: 'https://picsum.photos/seed/indiegames/800/400',
    imageAlt: 'Abstract pixel art landscape representing indie games',
    topic: 'gaming', // Required
  },
   // --- Mature ---
  {
    slug: 'philosophy-of-existence',
    title: 'Exploring the Philosophy of Existence',
    date: '2024-07-17',
    excerpt: 'A brief delve into existential questions about meaning, purpose, and being.',
    content: `
## Fundamental Questions
Existential philosophy grapples with profound questions:
*   Why are we here?
*   What is the meaning of life?
*   How do we deal with freedom, responsibility, and mortality?

## Key Themes
*   **Absurdity:** The conflict between humanity's search for meaning and the apparent meaninglessness of the universe (Camus).
*   **Authenticity:** Living in accordance with one's own values and choices, rather than societal pressures (Sartre, Heidegger).
*   **Freedom & Responsibility:** We are radically free to define ourselves through our actions, which brings immense responsibility.
*   **Angst & Dread:** The anxiety arising from awareness of freedom and mortality.

These are complex topics with no easy answers, inviting ongoing reflection.
    `,
    author: 'Thinker Deeply',
    tags: ['Philosophy', 'Existentialism', 'Meaning', 'Mature', 'Reflection'], // Required
    imageUrl: 'https://picsum.photos/seed/existence/800/400',
    imageAlt: 'Silhouette of a person looking at a starry night sky',
    topic: 'mature', // Required
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


// These would interact with your backend/CMS/file system
// Ensure the input type matches the required fields in BlogPost
export async function createPost(postData: Omit<BlogPost, 'slug' | 'date'>): Promise<BlogPost> {
  console.log('Attempting to create post:', postData);

  // Basic validation within the function (Zod handles primary validation)
  if (!postData.title || !postData.topic || !postData.tags || postData.tags.length === 0 || !postData.excerpt || !postData.content || (!postData.imageUrl && !postData.imageFile) || ((postData.imageUrl || postData.imageFile) && !postData.imageAlt)) {
     // This indicates an issue either with form data reaching here or validation bypass
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
    topic: postData.topic, // Already validated as required
    tags: postData.tags,   // Already validated as required array
    author: postData.author || 'Anonymous', // Use provided or default
    imageUrl: postData.imageUrl, // URL from form (potentially after upload)
    imageAlt: postData.imageAlt, // Already validated
    // imageFile is handled before this function call (uploaded)
  };

  // Add to mock data (replace with DB call)
  mockPosts.unshift(newPost);
  console.log('Post created successfully:', newPost);
  return newPost;
}

// Update function needs to handle partial updates correctly
export async function updatePost(slug: string, postData: Partial<Omit<BlogPost, 'slug' | 'date' | 'author'>>): Promise<BlogPost | null> {
  console.log(`Attempting to update post ${slug}:`, postData);
  const index = mockPosts.findIndex(p => p.slug === slug);
  if (index === -1) {
    console.error(`Update Post Error: Post with slug "${slug}" not found.`);
    return null;
  }

  // Get the existing post
  const existingPost = mockPosts[index];

   // Merge data, ensuring required fields aren't accidentally removed
   const updatedPostData: BlogPost = {
     ...existingPost, // Start with existing data
     ...postData, // Overwrite with new data
     // Ensure required fields that might be in postData are correctly typed/present
     topic: postData.topic || existingPost.topic, // Fallback to existing if not provided
     tags: postData.tags || existingPost.tags, // Fallback to existing if not provided
     // Ensure imageUrl and imageAlt are consistent
     imageUrl: postData.imageUrl !== undefined ? postData.imageUrl : existingPost.imageUrl,
     imageAlt: postData.imageAlt !== undefined ? postData.imageAlt : existingPost.imageAlt,
   };

   // Re-validate essential fields after merge, just in case
   if (!updatedPostData.topic || !updatedPostData.tags || updatedPostData.tags.length === 0 || !updatedPostData.imageUrl || !updatedPostData.imageAlt) {
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
