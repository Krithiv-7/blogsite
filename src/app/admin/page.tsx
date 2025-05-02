import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import DeletePostButton from './_components/delete-post-button';

export default async function AdminPage() {
  const posts = await getAllPosts(); // Fetch posts server-side

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Posts</CardTitle>
          <CardDescription>Create, edit, or delete blog posts.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/admin/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No posts found. Create one!</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.slug}>
                  <TableCell className="font-medium">
                    <Link href={`/posts/${post.slug}`} target="_blank" className="hover:text-primary transition-colors" title="View Post">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(post.date), 'PPP')}</TableCell>
                  <TableCell className="text-right space-x-2">
                     <Button variant="outline" size="icon" asChild title="Edit Post">
                       <Link href={`/admin/edit/${post.slug}`}>
                         <Edit className="h-4 w-4" />
                         <span className="sr-only">Edit</span>
                       </Link>
                     </Button>
                     <DeletePostButton slug={post.slug} title={post.title} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export const revalidate = 0; // Ensure this page always fetches fresh data
