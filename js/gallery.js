/**
 * Gallery Handler - Masonry Grid with Featured Image
 * Lightweight, CSS-driven layout with lazy loading
 */

class GalleryHandler {
    constructor() {
        this.imageCount = 9;
        this.featuredImage = 'assets/images/gallery/FeaturedImage.webp';
        this.featuredImageFallback = 'assets/images/gallery/FeaturedImage.jpg';
        this.imagePath = 'assets/images/gallery/galery';
        this.imageExt = '.webp';
        this.imageExtFallback = '.jpg';
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
     * Build image paths array with extra images for bottom fill
     * Uses sequential order with random offset to prevent adjacent duplicates
     */
    getImagePaths() {
        const paths = [];
        for (let i = 1; i <= this.imageCount; i++) {
            paths.push({
                webp: `${this.imagePath}${i}${this.imageExt}`,
                fallback: `${this.imagePath}${i}${this.imageExtFallback}`
            });
        }
        
        // Random starting point (0-8) for variety on each page load
        const startOffset = Math.floor(Math.random() * this.imageCount);
        
        // First set: all 9 unique images in rotated order
        // Sequential order ensures no adjacent column duplicates
        const uniqueFirst = [];
        for (let i = 0; i < this.imageCount; i++) {
            uniqueFirst.push(paths[(startOffset + i) % this.imageCount]);
        }
        
        // Extra images with different offsets to avoid vertical repeats
        const extra1 = [];
        const extra2 = [];
        const offset1 = (startOffset + 3) % this.imageCount; // Offset by 3
        const offset2 = (startOffset + 6) % this.imageCount; // Offset by 6
        
        for (let i = 0; i < this.imageCount; i++) {
            extra1.push(paths[(offset1 + i) % this.imageCount]);
            extra2.push(paths[(offset2 + i) % this.imageCount]);
        }
        
        return [...uniqueFirst, ...extra1, ...extra2];
    }

    /**
     * Render the gallery
     */
    render() {
        const container = document.querySelector('#gallery .gallery-scroll-container');
        if (!container) return;

        const images = this.getImagePaths();

        // Build HTML structure with picture elements for webp with fallback
        container.innerHTML = `
            <div class="gallery-container">
                <div class="gallery-featured">
                    <picture>
                        <source srcset="${this.featuredImage}" type="image/webp">
                        <img src="${this.featuredImageFallback}" alt="LYMINA featured photo" loading="eager">
                    </picture>
                </div>
                <div class="gallery-masonry-wrapper">
                    <div class="gallery-masonry">
                        ${images.map(img => `
                            <div class="gallery-masonry-item">
                                <picture>
                                    <source srcset="${img.webp}" type="image/webp">
                                    <img src="${img.fallback}" alt="LYMINA gallery photo" loading="lazy">
                                </picture>
                            </div>
                        `).join('')}
                    </div>
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
