
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase/client-config'; // Firebase app instance
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push('/admin'); // Redirect to admin or dashboard after login
      router.refresh(); // Refresh to update auth state in layout/header
    } catch (error: any) {
      console.error("Login failed:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      // Firebase Auth error handling
      switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential': // Covers both wrong email/password in newer SDKs
               errorMessage = "Invalid email or password.";
               break;
          case 'auth/invalid-email':
               errorMessage = "Invalid email format.";
               break;
          case 'auth/too-many-requests':
               errorMessage = "Too many attempts. Please try again later.";
               break;
          // Add other specific Firebase error codes as needed
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
       <Card className="w-full max-w-sm">
         <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...form.register("email")}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <Input
                    id="password"
                    type="password"
                    required
                    {...form.register("password")}
                    disabled={isLoading}
                  />
                 {form.formState.errors.password && (
                    <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                 )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Login
              </Button>
            </form>
         </CardContent>
         <CardFooter className="text-center text-sm">
             Don&apos;t have an account?&nbsp;
             <Link href="/signup" className="underline hover:text-primary">
               Sign up
             </Link>
         </CardFooter>
       </Card>
     </div>
  );
}
