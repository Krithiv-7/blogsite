export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-6">
        © {currentYear} Blogify. All rights reserved.
      </div>
    </footer>
  );
}
