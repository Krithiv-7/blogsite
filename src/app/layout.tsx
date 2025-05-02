
import type { Metadata } from 'next';
import { Inter, Lora, Inconsolata } from 'next/font/google'; // Added Lora and Inconsolata
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context'; // Import AuthProvider

// Define fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-serif' });
const inconsolata = Inconsolata({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Blogify - Your Blogging Platform',
  description: 'Create, manage, and share your blog posts easily.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Add suppressHydrationWarning */}
      <body
        className={`${inter.variable} ${lora.variable} ${inconsolata.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
           <AuthProvider> {/* Wrap content with AuthProvider */}
              <Header />
              <main className="container mx-auto flex-grow px-4 py-8 md:px-6">
                {children}
              </main>
              <Footer />
              <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
