"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import type { BlogPost } from "@/types";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Define Zod schema for validation
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  excerpt: z.string().min(10, {
    message: "Excerpt must be at least 10 characters.",
  }).max(200, { message: "Excerpt cannot exceed 200 characters." }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  topic: z.enum(['tech', 'classic', 'food']).optional(), // Added topic field validation
  author: z.string().optional(),
  tags: z.string().optional(), // Comma-separated string for simplicity
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')), // Allow empty string
  imageAlt: z.string().optional(),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData?: BlogPost | null; // For editing
  onSubmit: (values: PostFormValues) => Promise<void>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export function PostForm({ initialData, onSubmit, isSubmitting, mode }: PostFormProps) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      topic: initialData?.topic || undefined, // Set initial topic
      author: initialData?.author || "",
      tags: initialData?.tags?.join(', ') || "",
      imageUrl: initialData?.imageUrl || "",
      imageAlt: initialData?.imageAlt || "",
    },
  });

  const cardTitle = mode === 'create' ? "Create New Post" : "Edit Post";
  const cardDescription = mode === 'create' ? "Fill in the details for your new blog post." : "Update the details of this blog post.";
  const submitButtonText = mode === 'create' ? "Create Post" : "Save Changes";

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{cardTitle}</CardTitle>
            <CardDescription>{cardDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Awesome Blog Post Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categorize your post. This affects filtering.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short summary of your post (max 200 characters)..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This appears in the post list preview.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog post content here (Markdown supported)..."
                      className="min-h-[250px] resize-y"
                      {...field}
                    />
                  </FormControl>
                   <FormDescription>
                    You can use Markdown for formatting.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Author's Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="react, nextjs, webdev" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Alt Text (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Description of the image" {...field} />
                      </FormControl>
                      <FormDescription>
                        Required if Image URL is provided, for accessibility.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
          </CardContent>
          <CardFooter>
             <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     {mode === 'create' ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
