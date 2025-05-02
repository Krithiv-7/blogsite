import type { BlogPost } from '@/types';

// Mock data - replace with actual data fetching logic (e.g., from a CMS, database, or markdown files)
export const mockPosts: BlogPost[] = [
  {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js',
    date: '2024-07-26',
    excerpt: 'Learn the basics of Next.js and how to set up your first project.',
    content: `
## Introduction

Next.js is a popular React framework for building server-rendered applications, static websites, and more. It offers features like file-based routing, server components, and image optimization out of the box.

## Setting Up

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-next-app
cd my-next-app
npm run dev
\`\`\`

This will start the development server on \`http://localhost:3000\`.

## Key Features

*   **File-based Routing:** Pages are automatically created based on files in the \`src/app\` directory.
*   **Server Components:** Render components on the server to reduce client-side JavaScript.
*   **Data Fetching:** Easily fetch data on the server or client.

Explore the documentation to learn more!
    `,
    author: 'Jane Doe',
    tags: ['Next.js', 'React', 'Web Development'],
    imageUrl: 'https://picsum.photos/seed/nextjs/800/400',
    imageAlt: 'Abstract code background',
  },
  {
    slug: 'styling-in-tailwind',
    title: 'Styling with Tailwind CSS',
    date: '2024-07-25',
    excerpt: 'Discover the power of utility-first CSS with Tailwind.',
    content: `
## What is Tailwind CSS?

Tailwind CSS is a utility-first CSS framework packed with classes like \`flex\`, \`pt-4\`, \`text-center\` and \`rotate-90\` that can be composed to build any design, directly in your markup.

## Advantages

*   **Rapid Prototyping:** Quickly build complex interfaces without writing custom CSS.
*   **Consistency:** Enforces a design system, leading to more consistent UIs.
*   **Performance:** Produces highly optimized CSS by purging unused styles.

## Example

\`\`\`html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-slate-500">You have a new message!</p>
  </div>
</div>
\`\`\`

Tailwind makes styling intuitive and fast.
    `,
    author: 'John Smith',
    tags: ['CSS', 'Tailwind CSS', 'Styling'],
    imageUrl: 'https://picsum.photos/seed/tailwind/800/400',
    imageAlt: 'Tailwind CSS logo',
  },
  {
    slug: 'state-management-react',
    title: 'State Management in React',
    date: '2024-07-24',
    excerpt: 'An overview of different state management solutions in React.',
    content: `
## The Challenge

Managing state effectively is crucial in complex React applications. As applications grow, prop drilling and managing shared state can become cumbersome.

## Solutions

1.  **useState & useReducer:** Built-in hooks for local component state.
2.  **Context API:** Share state across components without prop drilling. Suitable for global state like themes or user authentication.
3.  **External Libraries:**
    *   **Redux:** Predictable state container, great for large applications with complex state logic.
    *   **Zustand:** A small, fast, and scalable state-management solution using hooks.
    *   **Jotai:** Atomic state management, focusing on minimal API surface.

Choosing the right solution depends on the application's complexity and specific needs. Start simple with built-in hooks and introduce more powerful tools as required.
    `,
    author: 'Alice Green',
    tags: ['React', 'State Management', 'JavaScript'],
    imageUrl: 'https://picsum.photos/seed/reactstate/800/400',
    imageAlt: 'Diagram illustrating state flow',
  },
];

// Function to get all posts (replace with actual data fetching)
export async function getAllPosts(): Promise<BlogPost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Function to get a single post by slug (replace with actual data fetching)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 50));
  const post = mockPosts.find(p => p.slug === slug);
  return post || null;
}

// --- CRUD Operations (Example Placeholders) ---

// These would interact with your backend/CMS/file system
export async function createPost(postData: Omit<BlogPost, 'slug' | 'date'>): Promise<BlogPost> {
  console.log('Creating post:', postData);
  // Simulate creation
  const newPost: BlogPost = {
    ...postData,
    slug: postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    date: new Date().toISOString().split('T')[0], // Use current date
  };
  mockPosts.unshift(newPost); // Add to the beginning of the mock list
  return newPost;
}

export async function updatePost(slug: string, postData: Partial<BlogPost>): Promise<BlogPost | null> {
  console.log(`Updating post ${slug}:`, postData);
  const index = mockPosts.findIndex(p => p.slug === slug);
  if (index === -1) return null;

  // Create a new object for the updated post to avoid mutation issues if needed
  const updatedPost = { ...mockPosts[index], ...postData, slug }; // Ensure slug remains the same or update if title changed
  mockPosts[index] = updatedPost;
  return updatedPost;
}


export async function deletePost(slug: string): Promise<boolean> {
  console.log('Deleting post:', slug);
  const index = mockPosts.findIndex(p => p.slug === slug);
  if (index > -1) {
    mockPosts.splice(index, 1);
    return true;
  }
  return false;
}
