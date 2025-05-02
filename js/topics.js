// src/js/topics.js

// Define the configuration for each topic (similar to src/lib/topics.ts)
// We'll represent icons as simple strings or potentially use an icon font/SVG sprite later
const TOPICS_DATA = {
  tech: { label: 'Tech', icon: '💻', className: 'theme-tech' }, // Using emoji as placeholder
  classic: { label: 'Classic', icon: '🎨', className: 'theme-classic' },
  food: { label: 'Food', icon: '🍔', className: 'theme-food' }, // Changed icon
  health: { label: 'Health', icon: '❤️', className: 'theme-health' }, // Changed icon
  travel: { label: 'Travel', icon: '✈️', className: 'theme-travel' },
  cooking: { label: 'Cooking', icon: '🍳', className: 'theme-cooking' },
  guides: { label: 'Guides', icon: '📖', className: 'theme-guides' }, // Changed icon
  gaming: { label: 'Gaming', icon: '🎮', className: 'theme-gaming' },
  mature: { label: 'Mature', icon: '⚠️', className: 'theme-mature' },
};

const ALL_TOPICS_KEYS = Object.keys(TOPICS_DATA);
const MATURE_CONSENT_KEY = "mature_content_consent"; // Same key as before

// Helper function to get topic info by topic key
function getTopicInfo(topicKey) {
    return TOPICS_DATA[topicKey] || null;
}

// Function to get the currently applied topic class from the body
function getCurrentTopicKey() {
    const bodyClasses = document.body.classList;
    for (const key in TOPICS_DATA) {
        if (TOPICS_DATA[key].className && bodyClasses.contains(TOPICS_DATA[key].className)) {
            return key;
        }
    }
    // Fallback or default logic if no theme class is found initially
    // Check if any theme class exists, if not, apply default (tech)
    const hasThemeClass = Object.values(TOPICS_DATA).some(t => t.className && bodyClasses.contains(t.className));
    if (!hasThemeClass) {
        document.body.classList.add(TOPICS_DATA.tech.className); // Apply default theme class
        return 'tech';
    }
    return 'tech'; // Default if none found but some theme class exists
}


// Make functions available globally or export if using modules (not used here)
window.TOPICS_DATA = TOPICS_DATA;
window.ALL_TOPICS_KEYS = ALL_TOPICS_KEYS;
window.getTopicInfo = getTopicInfo;
window.getCurrentTopicKey = getCurrentTopicKey;
window.MATURE_CONSENT_KEY = MATURE_CONSENT_KEY;
