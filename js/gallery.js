/**
 * Gallery Handler - Masonry Grid with Featured Image
 * Lightweight, CSS-driven layout with lazy loading
 */

class GalleryHandler {
    constructor() {
        this.imageCount = 9;
        this.featuredImage = 'assets/images/gallery/FeaturedImage.jpg';
        this.imagePath = 'assets/images/gallery/galery';
    }

    init() {
        this.render();
    }

    /**
     * Shuffle array using Fisher-Yates algorithm
     */
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Build image paths array
     */
    getImagePaths() {
        const paths = [];
        for (let i = 1; i <= this.imageCount; i++) {
            paths.push(`${this.imagePath}${i}.jpg`);
        }
        return this.shuffle(paths);
    }

    /**
     * Render the gallery
     */
    render() {
        const container = document.querySelector('#gallery .gallery-scroll-container');
        if (!container) return;

        const images = this.getImagePaths();

        // Build HTML structure
        container.innerHTML = `
            <div class="gallery-container">
                <div class="gallery-featured">
                    <img src="${this.featuredImage}" alt="LYMINA featured photo" loading="eager">
                </div>
                <div class="gallery-masonry">
                    ${images.map(src => `
                        <div class="gallery-masonry-item">
                            <img src="${src}" alt="LYMINA gallery photo" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Remove old classes that might interfere
        container.classList.remove('gallery-scroll-container');
        container.className = 'gallery-wrapper';
    }
}

// Export for use in main.js
window.GalleryHandler = GalleryHandler;
