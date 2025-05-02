// src/js/theme.js

document.addEventListener('DOMContentLoaded', () => {
    const APPEARANCE_MODE_KEY = 'theme_appearance_mode'; // 'light' | 'system'
    const CURRENT_TOPIC_KEY = 'theme_current_topic'; // Stores the actual topic key like 'tech', 'food' etc.
    const MATURE_CONSENT_KEY = window.MATURE_CONSENT_KEY || 'mature_content_consent'; // Use globally defined key

    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const topicIcon = document.getElementById('topic-icon');
    const appearanceToggle = document.getElementById('appearance-toggle');
    const topicToggle = document.getElementById('topic-toggle');
    const appearanceMenu = document.getElementById('appearance-menu');
    const topicMenu = document.getElementById('topic-menu');
    const topicRadioGroup = document.getElementById('topic-radio-group');
    const matureConfirmDialog = document.getElementById('mature-confirm-dialog');
    const confirmMatureButton = document.getElementById('confirm-mature-button');
    const cancelMatureButton = document.getElementById('cancel-mature-button');

    let currentAppearanceMode = localStorage.getItem(APPEARANCE_MODE_KEY) || 'system';
    let currentTopic = localStorage.getItem(CURRENT_TOPIC_KEY) || 'tech'; // Default topic
    let hasMatureConsent = localStorage.getItem(MATURE_CONSENT_KEY) === 'true';
    let pendingTopic = null; // To store topic change awaiting mature confirmation


    // --- Helper Functions ---

    function applyDarkMode(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        if (sunIcon && moonIcon) {
             sunIcon.style.display = isDark ? 'none' : 'inline-block';
             moonIcon.style.display = isDark ? 'inline-block' : 'none';
        }
         // Update appearance toggle title
        if (appearanceToggle) {
            const modeText = currentAppearanceMode.charAt(0).toUpperCase() + currentAppearanceMode.slice(1);
            appearanceToggle.title = `Change Appearance (${modeText})`;
        }
    }

    function applySystemMode() {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyDarkMode(systemPrefersDark);
    }

    function setAppearanceMode(mode) { // 'light' or 'system'
        localStorage.setItem(APPEARANCE_MODE_KEY, mode);
        currentAppearanceMode = mode;
        if (mode === 'light') {
            applyDarkMode(false);
        } else { // System
            applySystemMode();
        }
        updateAppearanceSelectionVisuals();
    }

     function applyTopicStyle(topicKey) {
        if (!window.TOPICS_DATA || !window.TOPICS_DATA[topicKey]) return;

        const body = document.body;
        const newTopicConfig = window.TOPICS_DATA[topicKey];

        // Remove existing topic classes
        Object.values(window.TOPICS_DATA).forEach(config => {
            if (config.className) {
                body.classList.remove(config.className);
            }
        });

        // Add new topic class
        if (newTopicConfig.className) {
            body.classList.add(newTopicConfig.className);
        }

        // Update body font based on topic
        document.body.style.fontFamily = `var(--${newTopicConfig.bodyFontVar || 'font-sans'})`; // Use 'font-sans' as fallback

        // Update state and storage
        currentTopic = topicKey;
        localStorage.setItem(CURRENT_TOPIC_KEY, topicKey);

        // Update UI elements
        updateTopicSelectionVisuals();
        updateTopicIcon(topicKey);

         // Trigger a custom event for other parts of the app (like post filtering)
         document.dispatchEvent(new CustomEvent('topicChanged', { detail: { topic: topicKey } }));
    }


    function updateTopicIcon(topicKey) {
        if (!topicIcon || !window.TOPICS_DATA || !window.TOPICS_DATA[topicKey]) return;

        const topicInfo = window.TOPICS_DATA[topicKey];
        const iconHtml = topicInfo.iconSvg || topicInfo.icon; // Prefer SVG if available

        // Basic way to update icon (replace innerHTML or use SVG manipulation)
        // This example assumes icon is an emoji or simple text/char
         if (topicInfo.iconSvg) {
            topicIcon.innerHTML = topicInfo.iconSvg; // Inject SVG string
         } else {
            topicIcon.textContent = topicInfo.icon; // Fallback to emoji/char
         }


        // Update topic toggle button title
        if (topicToggle) {
             topicToggle.title = `Change Style (Current: ${topicInfo.label})`;
        }
    }


    function populateTopicMenu() {
        if (!topicRadioGroup || !window.ALL_TOPICS_KEYS || !window.TOPICS_DATA) return;

        topicRadioGroup.innerHTML = ''; // Clear existing items

        window.ALL_TOPICS_KEYS.forEach(key => {
            const topicInfo = window.TOPICS_DATA[key];
            const item = document.createElement('div');
            item.classList.add('radio-item');
            item.dataset.topicKey = key;

             // Add Icon (using emoji/char for simplicity here)
            const iconSpan = document.createElement('span');
            iconSpan.textContent = topicInfo.icon + ' '; // Add space after icon
            item.appendChild(iconSpan);


             // Add Label
            const labelSpan = document.createElement('span');
            labelSpan.textContent = topicInfo.label;
            item.appendChild(labelSpan);


            item.addEventListener('click', () => handleTopicChange(key));
            topicRadioGroup.appendChild(item);
        });

        updateTopicSelectionVisuals(); // Set initial selection
    }

    function updateAppearanceSelectionVisuals() {
         // This function could add a 'selected' class to the correct menu item if needed
         // For simplicity, we'll rely on the icon/title updates for now.
    }

     function updateTopicSelectionVisuals() {
        const items = topicRadioGroup.querySelectorAll('.radio-item');
        items.forEach(item => {
            item.classList.toggle('selected', item.dataset.topicKey === currentTopic);
        });
    }

    function handleTopicChange(newTopicKey) {
        if (newTopicKey === currentTopic) {
             closeDropdown(topicMenu); // Close dropdown if same topic selected
             return;
        }

        if (newTopicKey === 'mature' && !hasMatureConsent) {
            pendingTopic = newTopicKey;
            matureConfirmDialog.style.display = 'flex'; // Show dialog
        } else {
            applyTopicStyle(newTopicKey);
            closeDropdown(topicMenu); // Close dropdown after selection
        }
    }

    function confirmMature() {
        if (pendingTopic === 'mature') {
            localStorage.setItem(MATURE_CONSENT_KEY, 'true');
            hasMatureConsent = true;
            applyTopicStyle('mature');
        }
        matureConfirmDialog.style.display = 'none';
        pendingTopic = null;
        closeDropdown(topicMenu); // Close dropdown after confirmation
    }

    function cancelMature() {
        matureConfirmDialog.style.display = 'none';
        pendingTopic = null;
        updateTopicSelectionVisuals(); // Reset radio selection visual if needed
        closeDropdown(topicMenu); // Close dropdown after cancellation
    }


    // --- Dropdown Logic ---
     function toggleDropdown(menu) {
        if (!menu) return;
        const isShown = menu.classList.contains('show');
        closeAllDropdowns(); // Close others before opening
        if (!isShown) {
            menu.classList.add('show');
        }
    }

    function closeDropdown(menu) {
         if (!menu) return;
         menu.classList.remove('show');
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content.show').forEach(closeDropdown);
    }


    // --- Initialization ---

    // Set initial theme based on stored preference or system setting
    if (currentAppearanceMode === 'light') {
        applyDarkMode(false);
    } else {
        applySystemMode();
         // Listen for system changes if mode is 'system'
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentAppearanceMode === 'system') {
                applySystemMode();
            }
        });
    }

     // Populate and set initial topic style
    populateTopicMenu();
    applyTopicStyle(currentTopic); // Apply initial topic style
    updateTopicIcon(currentTopic); // Set initial icon


    // --- Event Listeners ---

    // Dropdown Toggles
    if (appearanceToggle && appearanceMenu) {
         appearanceToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(appearanceMenu);
        });
    }
     if (topicToggle && topicMenu) {
        topicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(topicMenu);
        });
    }


    // Appearance Menu Items
    if (appearanceMenu) {
         appearanceMenu.querySelectorAll('[data-theme-mode]').forEach(item => {
             item.addEventListener('click', (e) => {
                 e.preventDefault();
                 const mode = e.currentTarget.dataset.themeMode;
                 setAppearanceMode(mode);
                 closeDropdown(appearanceMenu);
             });
         });
    }

    // Click outside to close dropdowns
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });

    // Mature Consent Dialog Buttons
     if (confirmMatureButton) {
        confirmMatureButton.addEventListener('click', confirmMature);
     }
     if (cancelMatureButton) {
        cancelMatureButton.addEventListener('click', cancelMature);
     }


    // Update year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Add basic SVG icons to topic data (replace placeholders later)
    // Example using Lucide names, assuming we might load SVGs later
    if (window.TOPICS_DATA) {
        window.TOPICS_DATA.tech.iconSvgName = 'Terminal';
        window.TOPICS_DATA.classic.iconSvgName = 'Palette';
        window.TOPICS_DATA.food.iconSvgName = 'Utensils';
        window.TOPICS_DATA.health.iconSvgName = 'HeartPulse';
        window.TOPICS_DATA.travel.iconSvgName = 'Plane';
        window.TOPICS_DATA.cooking.iconSvgName = 'ChefHat';
        window.TOPICS_DATA.guides.iconSvgName = 'BookMarked';
        window.TOPICS_DATA.gaming.iconSvgName = 'Gamepad2';
        window.TOPICS_DATA.mature.iconSvgName = 'AlertTriangle';

         // Function to create simple SVG placeholder (replace with actual SVGs if available)
        function getSimpleSvg(iconName = 'circle') {
            // Very basic placeholder - replace with real SVGs
            if (iconName === 'Terminal') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`;
            if (iconName === 'Palette') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`;
             if (iconName === 'Utensils') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></svg>`;
             if (iconName === 'HeartPulse') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.7-1 2.1 4.7 1.4-2.8h2.77"/></svg>`;
             if (iconName === 'Plane') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
             if (iconName === 'ChefHat') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><path d="M6 17h12"/></svg>`;
            if (iconName === 'BookMarked') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><polyline points="10 2 10 10 13 7 16 10 16 2"/></svg>`;
            if (iconName === 'Gamepad2') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.01.15A5.5 5.5 0 0 0 6.5 14.25V16a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3v-1.75A5.5 5.5 0 0 0 21.01 9.25c0-.05-.004-.098-.01-.15A4 4 0 0 0 17.32 5Z"/></svg>`;
             if (iconName === 'AlertTriangle') return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`; // Default circle
        }

        // Assign SVG strings to topics
        Object.keys(window.TOPICS_DATA).forEach(key => {
            window.TOPICS_DATA[key].iconSvg = getSimpleSvg(window.TOPICS_DATA[key].iconSvgName);
        });

         // Re-populate menu now that SVGs are assigned
        populateTopicMenu();
        // Update initial icon with SVG
        updateTopicIcon(currentTopic);
    }


}); // End DOMContentLoaded
