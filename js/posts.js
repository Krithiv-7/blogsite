// src/js/posts.js

// Mock data - replace with actual data fetching logic if needed (e.g., from a JSON file)
const MOCK_POSTS_DATA = [
  // --- Tech ---
  {
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Modern JS Frameworks', // Adjusted title for static context
    date: '2024-07-26',
    excerpt: 'Learn the basics of setting up your first project using modern JavaScript tools.',
    content: `
## Setting Up Your Environment

First, ensure you have Node.js and npm (or yarn) installed. You can download them from [https://nodejs.org/](https://nodejs.org/).

## Creating a Simple Project

Many frameworks offer command-line tools (CLIs) to scaffold projects:

\`\`\`bash
# Example using a generic tool (replace with actual framework CLI)
npx create-my-app my-project
cd my-project
npm install
npm run dev
\`\`\`

This typically sets up a development server and basic file structure.

## Key Concepts

*   **Components:** Reusable UI pieces.
*   **State Management:** Handling data that changes over time.
*   **Routing:** Navigating between different pages or views.
`,
    author: 'Tech Guru',
    tags: ['JavaScript', 'Web Development', 'Frontend', 'Setup'],
    imageUrl: 'https://picsum.photos/seed/modernjs/800/400',
    imageAlt: 'Abstract code background with JavaScript logos',
    topic: 'tech',
  },
  {
    slug: 'styling-in-tailwind',
    title: 'Utility-First CSS Approaches', // Adjusted title
    date: '2024-07-25',
    excerpt: 'Discover the power of utility-first CSS for rapid styling.',
    content: `
## What is Utility-First?

Instead of writing custom CSS classes like \`.button-primary\`, you compose styles directly in your HTML using pre-defined utility classes:

\`\`\`html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click Me
</button>
\`\`\`

## Benefits

*   **Rapid Development:** Quickly style elements without switching contexts.
*   **Consistency:** Enforces a design system.
*   **No Naming Conflicts:** Avoids common CSS naming headaches.
*   **Performance:** Can lead to smaller CSS bundles when optimized.

Frameworks like Tailwind CSS popularize this approach.
`,
    author: 'CSS Wizard',
    tags: ['CSS', 'Tailwind CSS', 'Styling', 'Frontend', 'Utility-First'],
    imageUrl: 'https://picsum.photos/seed/utilitycss/800/400',
    imageAlt: 'Utility CSS code snippets',
    topic: 'tech',
  },
   // --- Classic ---
  {
    slug: 'vintage-book-binding',
    title: 'The Art of Vintage Book Binding',
    date: '2024-07-23',
    excerpt: 'Exploring the traditional techniques of classic bookbinding.',
    content: `
## Traditional Methods

Bookbinding is a centuries-old craft. Traditional methods involve:

*   **Folding Sheets:** Arranging printed pages into signatures.
*   **Sewing:** Stitching the signatures together along the spine.
*   **Rounding and Backing:** Shaping the spine for durability and aesthetics.
*   **Case Making:** Creating the cover separately using boards, cloth, or leather.
*   **Casing In:** Attaching the text block to the cover.

## Tools of the Trade

*   Bone folder
*   Awl
*   Needles and thread
*   Book press
*   Guillotine (for trimming edges)

It's a meticulous process requiring patience and precision.
`,
    author: 'Edward Ledger',
    tags: ['Books', 'Craft', 'History', 'Classic', 'Binding'],
    imageUrl: 'https://picsum.photos/seed/bookbinding/800/400',
    imageAlt: 'Old books stacked with binding tools',
    topic: 'classic',
  },
  // --- Food ---
   {
    slug: 'perfect-sourdough',
    title: 'Baking the Perfect Sourdough Loaf',
    date: '2024-07-22',
    excerpt: 'A guide to achieving a tangy flavor and open crumb in your homemade sourdough.',
    content: `
## Understanding Sourdough

Sourdough relies on a **starter**, a symbiotic culture of yeast and bacteria (lactobacilli), for leavening and flavor development.

## Key Steps

1.  **Starter Maintenance:** Keep your starter active and bubbly by feeding it regularly with flour and water.
2.  **Mixing & Autolyse:** Combine flour, water, and starter, allowing it to rest (autolyse) before adding salt.
3.  **Bulk Fermentation:** Develop dough strength through folds and allow it to rise significantly.
4.  **Shaping:** Gently shape the dough into its final form.
5.  **Cold Proofing (Retardation):** Often done in the refrigerator overnight to develop flavor and make scoring easier.
6.  **Baking:** Typically baked at high heat, often in a Dutch oven, to create steam for a good crust and oven spring.

Patience is key! Each starter and environment is different.
`,
    author: 'Olivia Baker',
    tags: ['Baking', 'Sourdough', 'Food', 'Recipe', 'Bread'],
    imageUrl: 'https://picsum.photos/seed/sourdough/800/400',
    imageAlt: 'A golden-brown sourdough loaf on a wooden board',
    topic: 'food',
  },
  // --- Health ---
  {
    slug: 'mindfulness-for-beginners',
    title: 'Mindfulness Meditation for Beginners',
    date: '2024-07-21',
    excerpt: 'Simple techniques to start practicing mindfulness and reduce stress.',
    content: `
## What is Mindfulness?
Mindfulness is the practice of paying attention to the present moment without judgment. It can help reduce stress, improve focus, and enhance emotional regulation.

## Simple Exercise: Mindful Breathing
1. Find a quiet place to sit comfortably.
2. Close your eyes gently.
3. Bring your attention to your breath. Notice the sensation of air entering and leaving your body.
4. If your mind wanders, gently guide it back to your breath.
5. Start with 5 minutes daily.

Consistency is key. Even short sessions can make a difference. Other practices include mindful walking and body scans.
    `,
    author: 'Dr. Anya Sharma',
    tags: ['Mindfulness', 'Meditation', 'Health', 'Wellbeing', 'Stress Relief'],
    imageUrl: 'https://picsum.photos/seed/mindfulness/800/400',
    imageAlt: 'Person meditating peacefully outdoors',
    topic: 'health',
  },
  // --- Travel ---
   {
    slug: 'exploring-kyoto',
    title: 'A Weekend Guide to Exploring Kyoto',
    date: '2024-07-20',
    excerpt: 'Discover the ancient temples, serene gardens, and vibrant culture of Kyoto.',
    content: `
## Must-Visit Spots
*   **Fushimi Inari Shrine:** Walk through thousands of vibrant red torii gates. Best visited early morning to avoid crowds.
*   **Arashiyama Bamboo Grove:** Immerse yourself in the towering bamboo forest. Combine with a visit to Tenryū-ji Temple.
*   **Kinkaku-ji (Golden Pavilion):** Admire the stunning gold-leaf covered temple reflecting in the pond.
*   **Gion District:** Explore the traditional geisha district (be respectful of residents and geiko/maiko). Nishiki Market is also nearby for food exploration.

## Tips
*   Get an IC card (like Suica or Icoca) for easy payment on buses and trains.
*   Wear comfortable shoes - you'll do a lot of walking! Kyoto is best explored on foot and public transport.
*   Try local matcha tea and sweets, and consider a traditional Kaiseki dinner experience.
    `,
    author: 'Marco Polo Jr.',
    tags: ['Travel', 'Japan', 'Kyoto', 'Asia', 'Culture', 'Guide'],
    imageUrl: 'https://picsum.photos/seed/kyoto/800/400',
    imageAlt: 'Iconic red torii gates at Fushimi Inari Shrine in Kyoto',
    topic: 'travel',
  },
   // --- Cooking ---
  {
    slug: 'simple-pasta-aglio-olio',
    title: 'Simple & Delicious Pasta Aglio e Olio',
    date: '2024-07-19',
    excerpt: 'Master this classic Italian pasta dish with garlic, olive oil, and chili flakes.',
    content: `
## Ingredients (Serves 2)
*   200g Spaghetti or Linguine
*   4-6 cloves Garlic, thinly sliced
*   1/2 tsp Red chili flakes (or to taste, adjust based on preference)
*   1/4 cup (60ml) Good quality extra virgin olive oil
*   Salt to taste
*   Fresh parsley, chopped (about 2 tbsp, optional but recommended)
*   Parmesan cheese, grated (optional, for serving)

## Instructions
1. Cook spaghetti in a large pot of well-salted boiling water until al dente (usually 1 minute less than package directions). **Crucially, reserve about 1/2 cup (120ml) of the starchy pasta water before draining.**
2. While pasta cooks, heat olive oil in a large skillet or pan over medium-low heat. Add the sliced garlic and red chili flakes. Cook gently, swirling the pan occasionally, until the garlic is fragrant and just beginning to turn lightly golden (about 3-5 minutes). **Do not let the garlic brown or burn**, as it will become bitter. Remove from heat if it's cooking too quickly.
3. Drain the pasta and add it directly to the skillet with the garlic oil. Add a splash (about 1/4 cup) of the reserved pasta water.
4. Toss the pasta vigorously over medium heat, emulsifying the oil and water to create a light sauce that coats the pasta. Add more pasta water if needed to keep it saucy, not dry.
5. Season with salt to taste (remember the pasta water is salty). Stir in the chopped fresh parsley (if using).
6. Serve immediately, optionally topped with grated Parmesan cheese.
    `,
    author: 'Chef Isabella Rossi',
    tags: ['Cooking', 'Recipe', 'Pasta', 'Italian', 'Quick Meal', 'Vegetarian'],
    imageUrl: 'https://picsum.photos/seed/aglioolio/800/400',
    imageAlt: 'Close-up of pasta Aglio e Olio in a pan',
    topic: 'cooking',
  },
  // --- Guides ---
  {
    slug: 'choose-right-laptop',
    title: 'How to Choose the Right Laptop in 2024',
    date: '2024-07-18',
    excerpt: 'A comprehensive guide to help you select the perfect laptop for your needs.',
    content: `
## Key Considerations

1.  **Operating System:**
    *   **Windows:** Widest hardware compatibility, vast software library.
    *   **macOS:** Integrated ecosystem, strong creative software support, generally premium hardware.
    *   **ChromeOS:** Lightweight, web-focused, great for budget and education.
    *   **Linux:** Highly customizable, popular for development, requires more technical know-how.

2.  **Budget:** Determine your price range realistically. Ultrabooks, gaming laptops, and workstations vary significantly.

3.  **Use Case:**
    *   **General Use (Web, Office):** Core i3/Ryzen 3, 8GB RAM, 256GB SSD is often sufficient.
    *   **Work/Productivity:** Core i5/Ryzen 5+, 16GB+ RAM, 512GB+ SSD recommended.
    *   **Gaming:** Dedicated GPU (NVIDIA RTX or AMD Radeon RX) is crucial, plus high refresh rate display.
    *   **Creative Tasks (Video/Photo Editing, Design):** Powerful CPU (Core i7/Ryzen 7+), 16GB-32GB+ RAM, dedicated GPU, color-accurate display.

4.  **Screen Size & Quality:** 13-14" for portability, 15-16" for more screen real estate. Look for Full HD (1920x1080) minimum, good brightness (300+ nits), and color accuracy (sRGB coverage) if needed.

5.  **Portability:** Check weight (under 4 lbs / 1.8kg is considered portable) and advertised battery life (take reviews with a grain of salt).

6.  **Keyboard & Trackpad:** Crucial for user experience. Try them in person if possible. Backlit keyboards are useful.

7.  **Ports:** Ensure it has the necessary ports (USB-A, USB-C/Thunderbolt, HDMI, SD card reader).

Research specific model reviews from reputable tech sites before buying.
    `,
    author: 'Gadget Advisor',
    tags: ['Guides', 'Technology', 'Laptops', 'Buying Guide', 'Computers'],
    imageUrl: 'https://picsum.photos/seed/laptopguide/800/400',
    imageAlt: 'Various laptops displayed on a table',
    topic: 'guides',
  },
  // --- Gaming ---
  {
    slug: 'indie-game-gems-2024',
    title: 'Must-Play Indie Game Gems of 2024',
    date: '2024-07-16',
    excerpt: 'Discover hidden indie game treasures you might have missed this year.',
    content: `
## Top Picks So Far

*   **Pixel Pioneers:** A charming retro-style RPG reminiscent of classic SNES adventures, but with modern quality-of-life features and surprisingly deep crafting systems. Explore a vast world, recruit unique party members, and uncover ancient secrets.
*   **Neon Nights:** A ridiculously fast-paced cyberpunk action platformer. Think *Katana ZERO* meets *Celeste*. Features challenging levels, a stylish pixel art aesthetic, and an absolutely killer synthwave soundtrack. High replayability with speedrun potential.
*   **Whispering Woods:** A narrative-driven adventure game focusing on exploration and atmosphere. Set in a beautifully hand-drawn forest, you uncover a touching story through environmental storytelling and light puzzle-solving. More of an experience than a traditional game.
*   **Cosmic Cartographers:** A relaxing space exploration and trading simulator with procedural generation. Chart unknown star systems, trade resources, upgrade your ship, and encounter strange alien species. Perfect for unwinding.

Don't sleep on the indie scene! Support these developers and find your next obsession. Available on Steam, Itch.io, and sometimes consoles.
    `,
    author: 'Gamer Nexus',
    tags: ['Gaming', 'Indie Games', 'PC Gaming', 'Console Gaming', 'Review'],
    imageUrl: 'https://picsum.photos/seed/indiegames/800/400',
    imageAlt: 'Abstract pixel art landscape representing indie games',
    topic: 'gaming',
  },
   // --- Mature ---
  {
    slug: 'philosophy-of-existence',
    title: 'Exploring the Philosophy of Existence',
    date: '2024-07-17',
    excerpt: 'A brief delve into existential questions about meaning, purpose, and being.',
    content: `
## Fundamental Questions
Existential philosophy, emerging prominently in the 19th and 20th centuries, confronts the unique challenges and paradoxes of human existence. It grapples with profound questions:
*   Why is there something rather than nothing?
*   If the universe is indifferent, how do we create meaning?
*   What does it mean to live an authentic life?
*   How do we confront the inevitability of death and the weight of freedom?

## Key Themes & Thinkers
*   **Absurdity (Camus):** The conflict between humanity's innate search for meaning and the silent, meaningless universe. The response is not despair, but rebellion – embracing life despite the absurd.
*   **Freedom & Responsibility (Sartre):** "Existence precedes essence." We are born without a predetermined purpose and are defined by our choices. This radical freedom brings profound responsibility ("condemned to be free").
*   **Authenticity vs. Bad Faith (Sartre, Heidegger):** Living genuinely according to one's own values versus conforming to societal pressures or denying one's freedom (bad faith).
*   **Angst & Dread (Kierkegaard, Heidegger):** The anxiety that arises from the awareness of freedom, possibility, responsibility, and finitude (death).
*   **The Other (Sartre, Levinas):** How our relationship with other people shapes our self-understanding and ethical obligations.

Existentialism is not a single doctrine but a range of perspectives encouraging introspection and the courageous acceptance of the human condition.
    `,
    author: 'Thinker Deeply',
    tags: ['Philosophy', 'Existentialism', 'Meaning', 'Mature', 'Reflection'],
    imageUrl: 'https://picsum.photos/seed/existence/800/400',
    imageAlt: 'Silhouette of a person looking at a starry night sky',
    topic: 'mature',
  },
];


// Function to get all posts (sorted by date)
function getAllPosts() {
  // In a real static site, you might fetch this from a JSON file or API
  // For now, just return the mock data, sorted
  return [...MOCK_POSTS_DATA].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Function to get a single post by slug
function getPostBySlug(slug) {
  // In a real static site, you might filter the data fetched earlier
  return MOCK_POSTS_DATA.find(p => p.slug === slug) || null;
}

// --- CRUD Operations are not feasible in a static site ---
// Functions like createPost, updatePost, deletePost require a backend.

// Make functions available globally or export if using modules (not used here)
window.getAllPosts = getAllPosts;
window.getPostBySlug = getPostBySlug;
window.MOCK_POSTS_DATA = MOCK_POSTS_DATA; // Expose raw data if needed
