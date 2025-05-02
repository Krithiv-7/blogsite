
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, User } from 'lucide-react'; // Added User icon
import { format } from 'date-fns';
import DeletePostButton from './_components/delete-post-button';
import { getAuthenticatedUser } from '@/lib/auth/server-actions-auth'; // Auth helper
import { redirect } from 'next/navigation'; // For redirecting

export default async function AdminPage() {
  const user = await getAuthenticatedUser();

  // Redirect to login if not authenticated (middleware should handle this, but double-check)
  if (!user) {
     redirect('/login');
  }

  // Fetch all posts - filter client-side or modify getAllPosts to accept userId
  const allPosts = await getAllPosts();
  // Filter posts to show only those created by the current user
  const userPosts = allPosts.filter(post => post.authorUid === user.uid);

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            {user.username}'s Posts
          </CardTitle>
          <CardDescription>Manage your created blog posts.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/admin/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {userPosts.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">You haven't created any posts yet. Create one!</p>
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
              {userPosts.map((post) => (
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
                     {/* Pass author check if necessary, though actions already check auth */}
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

export const revalidate = 0; // Ensure this page always fetches fresh data for the logged-in user
