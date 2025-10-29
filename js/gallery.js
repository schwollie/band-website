/**
 * Gallery Handler
 * Auto-scrolling horizontal gallery with seamless loop
 */

class GalleryHandler {
    constructor() {
        this.galleryImageCount = 5; // Set this to the number of gallery images you have
    }

    init() {
        this.renderGallery();
    }

    /**
     * Shuffles array in place.
     * @param {Array} array items An array containing the items.
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Automatically generates gallery images for auto-scrolling display.
     */
    renderGallery() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;

        let imagePaths = [];
        for (let i = 1; i <= this.galleryImageCount; i++) {
            imagePaths.push(`assets/images/gallery/gallery${i}.jpeg`);
        }

        this.shuffleArray(imagePaths); // Randomize the image order

        // Triple the images for truly seamless infinite scroll
        // This ensures there are always enough images visible during animation
        const allImages = [...imagePaths, ...imagePaths, ...imagePaths];

        const galleryHTML = allImages.map(path => `
            <div class="gallery-item">
                <img src="${path}" alt="Lymina gallery image" loading="lazy">
            </div>
        `).join('');

        galleryTrack.innerHTML = galleryHTML;
    }

    // Method to update gallery image count
    setImageCount(count) {
        this.galleryImageCount = count;
        this.renderGallery();
    }
}

// Export for use in main.js
window.GalleryHandler = GalleryHandler;
