
import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';

// Generate static paths for all posts at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl"> {/* Adjusted max-width */}
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2 text-muted-foreground hover:text-primary">
         <Link href="/">
           <ArrowLeft className="mr-2 h-4 w-4" />
           Back to posts
         </Link>
      </Button>

      {post.imageUrl && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg"> {/* Use aspect ratio */}
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            fill // Use fill instead of layout
            className="object-cover" // Ensure image covers the area
            priority // Prioritize loading the main image
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 896px" // Provide sizes for responsiveness
            data-ai-hint={post.tags?.join(' ') || 'blog post header'}
          />
        </div>
      )}

      <header className="mb-8">
         <h1 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight text-foreground lg:text-5xl">
           {post.title}
         </h1>
         <p className="text-base text-muted-foreground">
            {/* Display authorUsername */}
           Posted on {format(new Date(post.date), 'PPP')} {post.authorUsername && `by ${post.authorUsername}`}
         </p>

         {post.tags && post.tags.length > 0 && (
           <div className="mt-4 flex flex-wrap gap-2">
             {post.tags.map((tag) => (
               <Badge key={tag} variant="secondary">{tag}</Badge>
             ))}
           </div>
         )}
      </header>

      <Separator className="my-8" />

       {/* Apply Tailwind Typography plugin classes.
           Dark mode is handled automatically by the plugin config. */}
      <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-primary hover:prose-a:underline prose-img:rounded-md prose-img:shadow-sm">
        <ReactMarkdown>
            {post.content}
        </ReactMarkdown>
      </div>

    </article>
  );
}

// Optional: Add metadata generation for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Blogify`,
    description: post.excerpt,
    openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  };
}

export const revalidate = 60; // Revalidate static pages if content changes
