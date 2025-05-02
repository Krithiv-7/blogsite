# Blogify (Static Version)

This is a static HTML, CSS, and JavaScript version of the Blogify application.

## Running the Site

Since this is a static site, there's no complex build process required.

1.  **Open `index.html`:** You can simply open the `index.html` file directly in your web browser.
2.  **Use a Simple HTTP Server (Recommended for some features):** For features that might behave differently when opened directly from the filesystem (like certain routing or fetch requests if added later), it's better to use a simple local server.
    *   If you have Node.js installed, you can use `npx live-server` or `npx http-server` in the project's root directory.
    *   Example using `live-server`:
        ```bash
        npx live-server
        ```
    *   This will typically open the site in your browser at `http://localhost:8080` or similar.

## Structure

*   `index.html`: The main homepage.
*   `post.html`: Template for displaying individual posts.
*   `css/style.css`: Contains all the styling for the site, including themes.
*   `js/`: Contains the JavaScript files:
    *   `topics.js`: Defines available blog topics and their configurations.
    *   `posts.js`: Contains the mock blog post data.
    *   `theme.js`: Handles theme (light/dark/system) and topic style switching.
    *   `app.js`: Logic for the homepage (fetching/displaying posts).
    *   `post-detail.js`: Logic for the individual post page.

## Limitations

This static version simulates some features of the original Next.js app but lacks server-side capabilities. User authentication, admin panels, and persistent post creation/editing are not included. Data is managed client-side using mock data in JavaScript files.
