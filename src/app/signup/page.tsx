
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { app } from '@/lib/firebase/client-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Schema includes username, email, and password with confirmation
const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(30, { message: "Username cannot exceed 30 characters." }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Attach error to confirmPassword field
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // 1. Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // 2. Update the user's profile with the username
      // Firebase Auth uses 'displayName' for this purpose.
      await updateProfile(user, {
        displayName: data.username,
      });

      toast({
        title: "Signup Successful",
        description: "Your account has been created. Welcome!",
      });
      // User is automatically logged in after signup
      router.push('/admin'); // Redirect to dashboard or admin page
      router.refresh(); // Refresh to update auth state in layout/header

    } catch (error: any) {
      console.error("Signup failed:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      // Firebase Auth error handling
      switch (error.code) {
          case 'auth/email-already-in-use':
               errorMessage = "This email address is already registered.";
               break;
          case 'auth/invalid-email':
               errorMessage = "Invalid email format.";
               break;
          case 'auth/weak-password':
                errorMessage = "Password is too weak. Please choose a stronger one.";
                break;
           // Add other specific Firebase error codes as needed
      }
      toast({
        title: "Signup Failed",
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
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your details below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="your_username"
                  required
                  {...form.register("username")}
                  disabled={isLoading}
                />
                {form.formState.errors.username && (
                  <p className="text-xs text-destructive">{form.formState.errors.username.message}</p>
                )}
             </div>
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
            <div className="space-y-2">
               <Label htmlFor="confirmPassword">Confirm Password</Label>
               <Input
                 id="confirmPassword"
                 type="password"
                 required
                 {...form.register("confirmPassword")}
                 disabled={isLoading}
               />
               {form.formState.errors.confirmPassword && (
                 <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
               )}
             </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          Already have an account?&nbsp;
          <Link href="/login" className="underline hover:text-primary">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
