// src/js/app.js

document.addEventListener('DOMContentLoaded', () => {
    const postListContainer = document.getElementById('post-list');
    const noPostsMessage = document.getElementById('no-posts-message');
    const pageTitle = document.getElementById('page-title');

    let allPosts = [];
    let filteredPosts = [];
    let isLoading = true;
    let currentSelectedTopic = window.getCurrentTopicKey ? window.getCurrentTopicKey() : 'tech'; // Get initial topic

    // --- Helper Functions ---

    function formatDate(dateString) {
        try {
             // Use date-fns; ensure dateFns is globally available (from CDN script in HTML)
             if (typeof dateFns !== 'undefined' && dateFns.format && dateFns.parseISO) {
                const date = dateFns.parseISO(dateString);
                return dateFns.format(date, 'PPP'); // Format like 'Jul 26th, 2024'
             } else {
                 // Fallback basic formatting if date-fns fails
                 const date = new Date(dateString);
                 return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
             }
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString; // Return original string on error
        }
    }

    function renderPosts(postsToRender) {
        if (!postListContainer) return;

        postListContainer.innerHTML = ''; // Clear current posts or skeletons

        if (postsToRender.length === 0) {
            if (noPostsMessage) {
                 const topicLabel = window.getTopicInfo(currentSelectedTopic)?.label.toLowerCase() || '';
                noPostsMessage.textContent = `No ${topicLabel} posts found for this style.`;
                noPostsMessage.style.display = 'block';
            }
            return;
        }

        if (noPostsMessage) {
            noPostsMessage.style.display = 'none';
        }

        postsToRender.forEach(post => {
            const topicInfo = window.getTopicInfo ? window.getTopicInfo(post.topic) : null;
            const postCard = document.createElement('div');
            postCard.classList.add('card');

            let imageHtml = '';
            if (post.imageUrl) {
                imageHtml = `
                    <div class="card-image-container">
                        <img src="${post.imageUrl}" alt="${post.imageAlt || post.title}" loading="lazy" class="card-image" data-ai-hint="${post.tags?.join(' ') || 'blog post image'}">
                    </div>
                `;
            }

            let topicBadgeHtml = '';
            if (topicInfo) {
                // Use SVG if available, otherwise emoji/char
                const iconContent = topicInfo.iconSvg || topicInfo.icon;
                topicBadgeHtml = `
                    <span class="badge badge-outline badge-topic">
                        ${iconContent} <!-- Inject SVG or emoji -->
                        ${topicInfo.label}
                    </span>
                `;
            }


            postCard.innerHTML = `
                ${imageHtml}
                <div class="card-header">
                     ${topicBadgeHtml}
                    <h2 class="card-title">
                        <a href="post.html?slug=${post.slug}">${post.title}</a>
                    </h2>
                    <p class="card-description">
                        ${formatDate(post.date)} ${post.author ? `by ${post.author}` : ''}
                    </p>
                </div>
                <div class="card-content">
                    <p>${post.excerpt}</p>
                </div>
                <div class="card-footer">
                    <div class="card-tags">
                        ${post.tags.map(tag => `<span class="badge badge-secondary">${tag}</span>`).join('')}
                    </div>
                    <a href="post.html?slug=${post.slug}" class="button button-link">Read More</a>
                </div>
            `;
            postListContainer.appendChild(postCard);
        });
    }

    function renderSkeletons(count = 6) {
         if (!postListContainer) return;
         postListContainer.innerHTML = ''; // Clear existing
         for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.classList.add('skeleton-card');
             // Simple skeleton structure - can be enhanced
            skeleton.innerHTML = `
                 <div style="height: 12rem; background-color: hsl(var(--muted-hsl)); border-radius: 4px; margin-bottom: 1rem;"></div>
                 <div style="height: 1.5rem; width: 75%; background-color: hsl(var(--muted-hsl)); border-radius: 4px; margin-bottom: 0.5rem;"></div>
                 <div style="height: 1rem; width: 50%; background-color: hsl(var(--muted-hsl)); border-radius: 4px; margin-bottom: 1rem;"></div>
                 <div style="height: 1rem; width: 100%; background-color: hsl(var(--muted-hsl)); border-radius: 4px; margin-bottom: 0.25rem;"></div>
                 <div style="height: 1rem; width: 100%; background-color: hsl(var(--muted-hsl)); border-radius: 4px; margin-bottom: 0.25rem;"></div>
                 <div style="height: 1rem; width: 66%; background-color: hsl(var(--muted-hsl)); border-radius: 4px; margin-bottom: 1.5rem;"></div>
                 <div style="display: flex; justify-content: space-between;">
                     <div style="display: flex; gap: 0.5rem;">
                         <div style="height: 1.25rem; width: 4rem; background-color: hsl(var(--muted-hsl)); border-radius: 99px;"></div>
                         <div style="height: 1.25rem; width: 3rem; background-color: hsl(var(--muted-hsl)); border-radius: 99px;"></div>
                     </div>
                     <div style="height: 1.5rem; width: 5rem; background-color: hsl(var(--muted-hsl)); border-radius: 4px;"></div>
                 </div>
            `;
            postListContainer.appendChild(skeleton);
         }
    }


    function filterAndRenderPosts(topic) {
        currentSelectedTopic = topic; // Update the current topic

        // Update page title
        if (pageTitle) {
            const topicInfo = window.getTopicInfo ? window.getTopicInfo(topic) : null;
            pageTitle.textContent = `${topicInfo?.label || 'Latest'} Posts`;
        }

        if (topic === 'all') { // Though 'all' isn't a button anymore, keep logic just in case
            filteredPosts = allPosts;
        } else {
            filteredPosts = allPosts.filter(post => post.topic === topic);
        }
        renderPosts(filteredPosts);
    }


    // --- Initialization ---

    // Initial skeleton render
    renderSkeletons();

    // Fetch posts (simulated)
    // In a real static site, you might fetch from a JSON file
    // or just use the data directly from posts.js
    if (window.getAllPosts) {
        allPosts = window.getAllPosts(); // Get data from posts.js
        isLoading = false;
        // Initial filter based on the theme loaded by theme.js
        filterAndRenderPosts(currentSelectedTopic);
    } else {
        console.error("Post data or getAllPosts function not found.");
        isLoading = false;
        if (postListContainer) postListContainer.innerHTML = ''; // Clear skeletons
        if (noPostsMessage) {
            noPostsMessage.textContent = "Error loading posts.";
            noPostsMessage.style.display = 'block';
        }
    }


    // --- Event Listeners ---

    // Listen for topic changes triggered by theme.js
    document.addEventListener('topicChanged', (event) => {
        if (event.detail && event.detail.topic) {
             filterAndRenderPosts(event.detail.topic);
        }
    });


}); // End DOMContentLoaded
