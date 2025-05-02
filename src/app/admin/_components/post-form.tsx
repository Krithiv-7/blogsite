
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
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
} from "@/components/ui/select";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost, BlogTopic } from "@/types";
import { ALL_TOPICS, getTopicInfo } from "@/lib/topics"; // Import topic definitions

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

// Define Zod schema for validation
// Removed author field from schema
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
  topic: z.enum(ALL_TOPICS, { required_error: "Please select a topic." }),
  tags: z.string().min(1, { message: "Please enter at least one tag."}),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageFile: z
    .custom<File | null>((file) => file instanceof File || file === null, "Invalid file type")
    .refine(
        (file) => !file || file.size <= MAX_FILE_SIZE,
        `Max file size is 5MB.`
    )
    .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png, .webp and .gif formats are supported."
    ).optional(),
  imageAlt: z.string().optional(),
}).refine(data => !!data.imageUrl || !!data.imageFile, {
    message: "Either an Image URL or an uploaded image is required.",
    path: ["imageFile"],
}).refine(data => !(data.imageUrl && data.imageFile), {
    message: "Please provide either an Image URL or upload an image, not both.",
    path: ["imageFile"],
}).refine(data => (data.imageUrl || data.imageFile) ? !!data.imageAlt : true, {
    message: "Image Alt Text is required if an image is provided.",
    path: ["imageAlt"],
});


type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData?: BlogPost | null; // For editing
  onSubmit: (values: PostFormValues) => Promise<void>;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
}

export function PostForm({ initialData, onSubmit, isSubmitting, mode }: PostFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      topic: initialData?.topic || undefined,
      // Removed author field from defaultValues
      tags: initialData?.tags?.join(', ') || "",
      imageUrl: initialData?.imageUrl || "",
      imageFile: null,
      imageAlt: initialData?.imageAlt || "",
    },
  });

  const cardTitle = mode === 'create' ? "Create New Post" : "Edit Post";
  const cardDescription = mode === 'create' ? "Fill in the details for your new blog post." : "Update the details of this blog post.";
  const submitButtonText = mode === 'create' ? "Create Post" : "Save Changes";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
          form.setError("imageFile", { type: "manual", message: `Max file size is 5MB.` });
          setImagePreview(null);
          form.setValue("imageFile", null);
          return;
       }
       if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          form.setError("imageFile", { type: "manual", message: "Only .jpg, .jpeg, .png, .webp and .gif formats are supported." });
          setImagePreview(null);
          form.setValue("imageFile", null);
          return;
       }

       form.setValue("imageUrl", "");
       form.setValue("imageFile", file);
       form.clearErrors("imageFile");
       form.clearErrors("imageUrl");

       const reader = new FileReader();
       reader.onloadend = () => {
         setImagePreview(reader.result as string);
       };
       reader.readAsDataURL(file);
    } else {
        if (!initialData?.imageUrl) {
             setImagePreview(null);
        }
        form.setValue("imageFile", null);
    }
  };

  const handleRemoveImage = useCallback(() => {
      setImagePreview(null);
      form.setValue("imageFile", null);
      form.setValue("imageUrl", "");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      form.clearErrors("imageFile");
      form.clearErrors("imageUrl");
      form.trigger(["imageFile", "imageUrl", "imageAlt"]);
  }, [form, initialData?.imageUrl]);

   const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const url = event.target.value;
        form.setValue("imageUrl", url);
        if (url) {
            setImagePreview(url);
            form.setValue("imageFile", null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            form.clearErrors("imageFile");
            form.trigger("imageUrl");
        } else {
            const imageFile = form.getValues("imageFile");
            if (imageFile) {
                 const reader = new FileReader();
                 reader.onloadend = () => {
                   setImagePreview(reader.result as string);
                 };
                 reader.readAsDataURL(imageFile);
            } else {
               setImagePreview(null);
            }
             form.trigger(["imageFile", "imageUrl", "imageAlt"]);
        }
    };

   const processAndSubmit = (values: PostFormValues) => {
     console.log("Raw form values:", values);

     // Removed author processing
     const processedValues = {
       ...values,
       tags: values.tags.split(',').map(tag => tag.trim()).filter(Boolean)
     };

     console.log("Processed form values:", processedValues);
     onSubmit(processedValues as any);
   };


  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(processAndSubmit)}>
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
                  <FormLabel>Topic *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALL_TOPICS.map(topicKey => {
                        const topicInfo = getTopicInfo(topicKey);
                        return topicInfo ? (
                          <SelectItem key={topicKey} value={topicKey}>
                            <div className="flex items-center gap-2">
                              <topicInfo.icon className="h-4 w-4 text-muted-foreground" />
                              {topicInfo.label}
                            </div>
                          </SelectItem>
                        ) : null;
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categorize your post. This affects filtering and styling.
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
            {/* Image Section */}
             <FormField
                control={form.control}
                name="imageFile" // Control the imageFile field now
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image *</FormLabel>
                    <FormDescription>Upload an image or provide an external URL.</FormDescription>
                    <div className="space-y-4">
                       {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative group w-full aspect-video rounded-md overflow-hidden border">
                                <Image
                                    src={imagePreview}
                                    alt={form.getValues("imageAlt") || "Image preview"}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8"
                                    onClick={handleRemoveImage}
                                    title="Remove Image"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove Image</span>
                                </Button>
                             </div>
                         )}

                        {/* File Upload Input */}
                         <FormControl>
                           <div className="flex flex-col sm:flex-row gap-4 items-start">
                             <Button
                                type="button"
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={!!form.watch("imageUrl")} // Disable if URL is entered
                                className="w-full sm:w-auto"
                              >
                                <UploadCloud className="mr-2 h-4 w-4" />
                                {form.watch("imageFile") ? "Change Image" : "Upload Image"}
                              </Button>
                              <input
                                type="file"
                                ref={fileInputRef}
                                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={!!form.watch("imageUrl")}
                              />

                              <span className="text-muted-foreground text-sm mt-2 sm:mt-0">or</span>

                             {/* Image URL Input */}
                              <Input
                                type="url"
                                placeholder="Enter Image URL"
                                value={form.watch("imageUrl")}
                                onChange={handleImageUrlChange}
                                disabled={!!form.watch("imageFile")} // Disable if file is uploaded
                                className="flex-grow"
                              />
                            </div>
                          </FormControl>
                    </div>
                    <FormMessage />
                 </FormItem>
                )}
              />

            {/* Image Alt Text */}
             <FormField
                control={form.control}
                name="imageAlt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Alt Text *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Concise description of the image"
                        {...field}
                        disabled={!form.watch("imageUrl") && !form.watch("imageFile")} // Disable if no image source
                      />
                    </FormControl>
                    <FormDescription>
                      Required for accessibility if an image is provided.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* Removed Author Field */}
             <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags *</FormLabel>
                    <FormControl>
                      <Input placeholder="react, nextjs, webdev" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated list of tags (e.g., tech, tutorial, review). Required.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
