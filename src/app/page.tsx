
"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/posts'; // Fetch all posts initially
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import type { BlogPost, BlogTopic } from '@/types'; // Import BlogTopic
import { Skeleton } from '@/components/ui/skeleton';
import { TOPICS, getTopicInfo, getTopicFromClassName } from '@/lib/topics'; // Import topic configurations

export default function Home() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<BlogTopic | 'all'>('tech'); // Default to 'tech' or derive from initial class

  // Fetch all posts initially
  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      try {
        const posts = await getAllPosts();
        setAllPosts(posts);
        // Initial filtering will be done by the observer effect
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // Handle error display if necessary
      } finally {
        setIsLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Filter posts based on the selected topic
  const filterPosts = useCallback((topic: BlogTopic | 'all') => {
    if (topic === 'all') {
      setFilteredPosts(allPosts);
    } else {
      setFilteredPosts(allPosts.filter(post => post.topic === topic));
    }
  }, [allPosts]);


  // Listen for changes in body class to update filter based on theme/topic
  useEffect(() => {
     const observer = new MutationObserver((mutations) => {
       mutations.forEach((mutation) => {
         if (mutation.attributeName === 'class') {
           const bodyClasses = document.body.classList;
           let currentTopic: BlogTopic = 'tech'; // Default
            for (const [key, config] of Object.entries(TOPICS)) {
                if (config.className && bodyClasses.contains(config.className)) {
                   currentTopic = key as BlogTopic;
                   break;
                }
            }
           setSelectedTopic(currentTopic);
           // Filter posts whenever the topic changes
           filterPosts(currentTopic);
         }
       });
     });

     observer.observe(document.body, { attributes: true });

     // Initial check and filter
      const bodyClasses = document.body.classList;
      let initialTopic: BlogTopic = 'tech'; // Default
      for (const [key, config] of Object.entries(TOPICS)) {
          if (config.className && bodyClasses.contains(config.className)) {
              initialTopic = key as BlogTopic;
              break;
          }
      }
      setSelectedTopic(initialTopic);
      filterPosts(initialTopic); // Initial filter


     return () => observer.disconnect();
   }, [filterPosts]); // Add filterPosts to dependency array


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-baseline gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
             {/* Dynamically display the current topic name */}
             {`${getTopicInfo(selectedTopic)?.label || 'Latest'} Posts`}
          </h1>
           {/* Filter buttons removed as filtering is handled by ThemeSwitcher */}
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
            {/* Show message based on the selected topic */}
            No {selectedTopic !== 'all' ? getTopicInfo(selectedTopic)?.label.toLowerCase() : ''} posts found for this style.
            {selectedTopic !== 'all' && ' Try selecting a different style in the header.'}
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
                            fill
                            style={{objectFit:"cover"}}
                            className="transition-opacity duration-300 group-hover:opacity-90"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            data-ai-hint={post.tags?.join(' ') || 'blog post image'}
                        />
                    </div>
                )}
                <CardHeader>
                    {topicInfo && (
                       <Badge variant="outline" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm flex items-center gap-1">
                          <topicInfo.icon className="h-3 w-3"/>
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
