import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Latest Posts
      </h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="flex transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
              {post.imageUrl && (
                 <div className="relative h-48 w-full">
                    <Image
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-opacity duration-300 group-hover:opacity-90"
                        data-ai-hint={post.tags?.join(' ') || 'blog post image'}
                    />
                 </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl leading-tight">
                  <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {format(new Date(post.date), 'PPP')} {post.author && `by ${post.author}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
                <Button variant="link" size="sm" asChild className="text-primary hover:underline p-0 h-auto">
                   <Link href={`/posts/${post.slug}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Revalidate data periodically or on demand if using ISR/On-Demand Revalidation
export const revalidate = 60; // Revalidate every 60 seconds (optional)
