import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed font for better readability
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster'; // Added toaster

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blogify - Your Blogging Platform', // Updated title
  description: 'Create, manage, and share your blog posts easily.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className="container mx-auto flex-grow px-4 py-8 md:px-6">
          {children}
        </main>
        <Footer />
        <Toaster /> {/* Added Toaster component */}
      </body>
    </html>
  );
}
