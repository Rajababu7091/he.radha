// Data for the gallery items
const galleryData = [
    { id: 1, src: 'images/img_1.jpg', caption: 'Divine love ✨' },
    { id: 2, src: 'images/img_2.jpg', caption: 'Radha Krishna Love' },
    { id: 3, src: 'images/img_3.jpg', caption: 'Jai Shree ram 🙏🚩🕉️' },
    { id: 4, src: 'images/img_4.webp', caption: 'Radha Krishna 🦚😍' },
    { id: 5, src: 'images/img_5.jpg', caption: 'Radha Krishna 🦚😍 Viral' },
    { id: 6, src: 'images/img_6.jpg', caption: 'Radha krishna 🦚♥️ Divine Love' },
    { id: 7, src: 'images/img_7.jpg', caption: 'Radha Krishna HD Love' },
    { id: 8, src: 'images/img_8.png', caption: 'Indian Temple 🙏' },
    { id: 9, src: 'images/img_9.png', caption: 'Divine love ✨ #radhakrishna' },
    { id: 10, src: 'images/img_10.png', caption: 'Peace inside devotion 🙏' },
    { id: 11, src: 'images/img_11.png', caption: 'Aesthetic edits for daily peace 🦚' },
    { id: 12, src: 'images/img_12.png', caption: 'Waiting with love 🌸' },
    { id: 13, src: 'images/img_13.jpg', caption: 'Super best lovely couple' },
    { id: 14, src: 'images/img_14.jpg', caption: 'Divine aesthetic wallpaper' },
    { id: 15, src: 'images/img_15.jpg', caption: '✨ Krishna’s playful smile fills hearts with love' },
    { id: 16, src: 'images/img_16.jpg', caption: '✨ Divine joy and peace' },
    { id: 17, src: 'images/img_17.jpg', caption: '✨ Krishna’s playful smile' },
    { id: 18, src: 'images/img_18.jpg', caption: 'Beautiful Devotion' }
];

document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const searchInput = document.getElementById('searchInput');

    // Function to render the images
    function renderGallery(items, append = false, isAI = false) {
        if (!append) {
            galleryGrid.innerHTML = '';
        }

        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'gallery-item';
            itemElement.style.animationDelay = `${(index % 10) * 0.1}s`;

            // If it's an AI image, download must fetch it first because it's a cross-origin URL.
            // For static pages without CORS setup, direct download of external images is blocked by browsers.
            // But we can at least provide the link to open it, or use a proxy. We'll link to it with target=_blank.
            const downloadBtnHTML = isAI
                ? `<a href="${item.src}" target="_blank" class="download-btn"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</a>`
                : `<a href="${item.src}" download="${item.src.split('/').pop()}" class="download-btn"><i class="fa-solid fa-download"></i> Download</a>`;

            const badgeHTML = isAI ? `<span style="background: var(--primary-glow); padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; margin-bottom: 5px; display: inline-block;">AI Generated</span>` : '';

            itemElement.innerHTML = `
                <img src="${item.src}" alt="${item.caption}">
                <div class="item-overlay">
                    ${downloadBtnHTML}
                </div>
                <div class="item-info">
                    ${badgeHTML}
                    <p>${item.caption}</p>
                </div>
            `;

            galleryGrid.appendChild(itemElement);
        });
    }

    // AI Generation Magic! Fetch from Pollinations API based on prompt
    async function fetchAIImages(query) {
        // We'll generate 4 unique AI images using random seeds
        const aiItems = [];
        for (let i = 0; i < 4; i++) {
            const seed = Math.floor(Math.random() * 100000);
            const encodedQuery = encodeURIComponent(query + ' aesthetic beautiful highly detailed');
            const url = `https://image.pollinations.ai/prompt/${encodedQuery}?nologo=true&seed=${seed}&width=600&height=800`;
            aiItems.push({
                id: `ai_${i}`,
                src: url,
                caption: `AI generated: "${query}"`
            });
        }
        return aiItems;
    }

    // Handle Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        clearTimeout(searchTimeout);

        // Debounce search
        searchTimeout = setTimeout(async () => {
            if (query === '') {
                renderGallery(galleryData);
                return;
            }

            // 1. Filter local images
            const filteredLocal = galleryData.filter(item =>
                item.caption.toLowerCase().includes(query)
            );

            // Render local exactly matching first
            renderGallery(filteredLocal);

            // 2. Add AI magical images for the query!
            // First show a loading indicator or just fetch them and append
            const loadingHtml = `
                <div id="ai-loading" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--primary-glow);">
                    <i class="fa-solid fa-wand-magic-sparkles fa-bounce"></i> Generating AI images for "${query}"...
                </div>
            `;
            galleryGrid.insertAdjacentHTML('beforeend', loadingHtml);

            try {
                const aiImages = await fetchAIImages(query);
                const loader = document.getElementById('ai-loading');
                if (loader) loader.remove();

                // Append AI generated images to the grid
                renderGallery(aiImages, true, true);
            } catch (err) {
                console.error("AI Generation failed", err);
                const loader = document.getElementById('ai-loading');
                if (loader) loader.remove();
            }

        }, 800); // 800ms debounce
    });

    // Render initially
    renderGallery(galleryData);
});
