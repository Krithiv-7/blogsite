"use client"; // Make this a client component for filtering

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts'; // We still fetch all initially
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { BlogPost } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { THEME_STYLES } from '@/components/theme-switcher'; // Import theme styles for labels/icons

type ThemeStyleKey = keyof typeof THEME_STYLES;

export default function Home() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<ThemeStyleKey | 'all'>('all'); // Default to 'all'

  // Fetch all posts initially
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const posts = await getAllPosts();
        setAllPosts(posts);
        setFilteredPosts(posts); // Initially show all
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // Handle error display if necessary
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Listen for changes in body class to update filter based on theme
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const bodyClasses = document.body.classList;
          let currentTopic: ThemeStyleKey | 'all' = 'tech'; // Default to tech if no class found
          if (bodyClasses.contains('theme-classic')) {
            currentTopic = 'classic';
          } else if (bodyClasses.contains('theme-food')) {
            currentTopic = 'food';
          }
          setSelectedTopic(currentTopic);
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    // Initial check
     const bodyClasses = document.body.classList;
      let initialTopic: ThemeStyleKey | 'all' = 'tech'; // Default to tech
      if (bodyClasses.contains('theme-classic')) {
        initialTopic = 'classic';
      } else if (bodyClasses.contains('theme-food')) {
        initialTopic = 'classic';
      } else if (bodyClasses.contains('theme-food')) {
        initialTopic = 'food';
      }
      setSelectedTopic(initialTopic);


    return () => observer.disconnect();
  }, []);

  // Filter posts when selectedTopic or allPosts change
  useEffect(() => {
    if (selectedTopic === 'all') {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(allPosts.filter(post => post.topic === selectedTopic));
    }
  }, [selectedTopic, allPosts]);


  // Function to get topic display info (label, icon)
  const getTopicInfo = (topic?: ThemeStyleKey) => {
    if (!topic || !THEME_STYLES[topic]) return null;
    return { label: THEME_STYLES[topic].label, Icon: THEME_STYLES[topic].icon };
  };


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {selectedTopic === 'all' ? 'Latest Posts' : `${THEME_STYLES[selectedTopic]?.label || 'Latest'} Posts`}
          </h1>
           {/* Optional: Add explicit filter buttons if desired, but theme switching handles it now */}
          {/*
          <div className="flex gap-2">
             <Button variant={selectedTopic === 'all' ? 'default' : 'outline'} onClick={() => setSelectedTopic('all')}>All</Button>
             <Button variant={selectedTopic === 'tech' ? 'default' : 'outline'} onClick={() => setSelectedTopic('tech')}>Tech</Button>
             <Button variant={selectedTopic === 'classic' ? 'default' : 'outline'} onClick={() => setSelectedTopic('classic')}>Classic</Button>
             <Button variant={selectedTopic === 'food' ? 'default' : 'outline'} onClick={() => setSelectedTopic('food')}>Food</Button>
          </div>
          */}
      </div>

      {isLoading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {[...Array(6)].map((_, index) => (
              <Card key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                 <Skeleton className="h-48 w-full" />
                 <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                 </CardHeader>
                 <CardContent className="flex-grow">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                 </CardContent>
                 <CardFooter className="flex justify-between">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                 </CardFooter>
              </Card>
           ))}
         </div>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
            No {selectedTopic !== 'all' ? THEME_STYLES[selectedTopic]?.label.toLowerCase() : ''} posts found.
            {selectedTopic !== 'all' && ' Try selecting a different theme style.'}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const topicInfo = getTopicInfo(post.topic);
            return (
                <Card key={post.slug} className="group flex transform flex-col overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
                {post.imageUrl && (
                    <div className="relative h-48 w-full">
                        <Image
                            src={post.imageUrl}
                            alt={post.imageAlt || post.title}
                            fill // Use fill instead of layout
                            style={{objectFit:"cover"}} // Use style object for objectFit
                            className="transition-opacity duration-300 group-hover:opacity-90"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust sizes
                            data-ai-hint={post.tags?.join(' ') || 'blog post image'}
                        />
                    </div>
                )}
                <CardHeader>
                    {topicInfo && (
                       <Badge variant="outline" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
                          <topicInfo.Icon className="mr-1.5 h-3 w-3"/>
                          {topicInfo.label}
                       </Badge>
                    )}
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
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                    {post.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">{tag}</Badge>
                    ))}
                    </div>
                    <Button variant="link" size="sm" asChild className="text-primary hover:underline p-0 h-auto">
                    <Link href={`/posts/${post.slug}`}>Read More</Link>
                    </Button>
                </CardFooter>
                </Card>
            );
           })}
        </div>
      )}
    </div>
  );
}

// Removed revalidate as filtering is now client-side
// export const revalidate = 60;
