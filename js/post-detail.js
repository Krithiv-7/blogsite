// src/js/post-detail.js

document.addEventListener('DOMContentLoaded', () => {
    const postContentContainer = document.getElementById('post-content');

    function getSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('slug');
    }

    function formatDate(dateString) {
        // Re-use the same formatting logic as app.js
        try {
             // Use date-fns; ensure dateFns is globally available
             if (typeof dateFns !== 'undefined' && dateFns.format && dateFns.parseISO) {
                 const date = dateFns.parseISO(dateString);
                 return dateFns.format(date, 'PPP'); // e.g., Jul 26th, 2024
             } else {
                 const date = new Date(dateString);
                 return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
             }
        } catch (e) {
             console.error("Error formatting date:", e);
             return dateString;
        }
    }


    function renderPost(post) {
        if (!postContentContainer || !post) {
            if(postContentContainer) postContentContainer.innerHTML = '<p>Post not found.</p>';
            document.title = "Post Not Found | Blogify"; // Update page title
            return;
        }

        // Update page title
        document.title = `${post.title} | Blogify`;

        let imageHtml = '';
        if (post.imageUrl) {
            imageHtml = `
                <div class="post-image-container">
                    <img src="${post.imageUrl}" alt="${post.imageAlt || post.title}" class="post-image" data-ai-hint="${post.tags?.join(' ') || 'blog post header'}">
                </div>
            `;
        }

        let tagsHtml = '';
        if (post.tags && post.tags.length > 0) {
            tagsHtml = `
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
                </div>
            `;
        }

        // Convert Markdown content to HTML using Marked.js
        // Ensure Marked.js is loaded (via CDN in HTML)
        let contentHtml = '<p>Error rendering content.</p>';
        if (typeof marked !== 'undefined') {
            try {
                 // Configure marked (optional: enable GitHub Flavored Markdown, breaks, etc.)
                 marked.setOptions({
                    breaks: true, // Add <br> on single line breaks
                    gfm: true, // Use GitHub Flavored Markdown
                 });
                 contentHtml = marked.parse(post.content);
            } catch (e) {
                console.error("Error parsing Markdown:", e);
            }
        } else {
            console.warn("Marked.js library not found. Cannot render Markdown.");
            // Fallback: display raw content or a message
            contentHtml = `<pre><code>${post.content}</code></pre>`; // Display as preformatted text
        }


        postContentContainer.innerHTML = `
             ${imageHtml}
             <header>
                 <h1>${post.title}</h1>
                 <p class="post-meta">
                     Posted on ${formatDate(post.date)} ${post.author ? `by ${post.author}` : ''}
                 </p>
                 ${tagsHtml}
             </header>
             <hr class="post-separator">
             <div class="prose">
                 ${contentHtml}
             </div>
        `;
    }

    // --- Initialization ---

    const slug = getSlugFromUrl();

    if (!slug) {
        if (postContentContainer) postContentContainer.innerHTML = '<p>No post specified.</p>';
        document.title = "Error | Blogify";
        return;
    }

    // Fetch post data (simulated using data from posts.js)
    if (window.getPostBySlug) {
        const post = window.getPostBySlug(slug);
        renderPost(post);
    } else {
        console.error("getPostBySlug function not found.");
         if (postContentContainer) postContentContainer.innerHTML = '<p>Error loading post data function.</p>';
          document.title = "Error | Blogify";
    }

    // Update year in footer (copied from theme.js for standalone pages)
     const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

}); // End DOMContentLoaded
