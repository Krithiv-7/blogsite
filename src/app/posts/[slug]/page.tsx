import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown'; // Use react-markdown for rendering content

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
    <article className="prose prose-lg mx-auto max-w-4xl dark:prose-invert">
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground hover:text-primary">
         <Link href="/">
           <ArrowLeft className="mr-2 h-4 w-4" />
           Back to posts
         </Link>
      </Button>

      {post.imageUrl && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            layout="fill"
            objectFit="cover"
            priority // Prioritize loading the main image
            data-ai-hint={post.tags?.join(' ') || 'blog post header'}
          />
        </div>
      )}

      <h1 className="mb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">{post.title}</h1>
      <p className="mb-6 text-base text-muted-foreground">
        Posted on {format(new Date(post.date), 'PPP')} {post.author && `by ${post.author}`}
      </p>

      {post.tags && post.tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      )}

      <Separator className="my-8" />

       {/* Render Markdown Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:underline prose-img:rounded-md prose-img:shadow-sm">
        <ReactMarkdown>{post.content}</ReactMarkdown>
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
