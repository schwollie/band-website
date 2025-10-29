/**
 * Gallery Handler
 * Dynamic infinite scroll with random image loading
 */

class GalleryHandler {
    constructor() {
        this.galleryImageCount = 5; // Set this to the number of gallery images you have
        this.imagePaths = [];
        this.scrollSpeed = 50; // Pixels per second
        this.lastScrollTime = Date.now();
        this.currentOffset = 0;
        this.minImages = 15; // Minimum images to keep in the DOM
        this.imageWidth = 0; // Will be set after first image loads
        this.animationId = null;
    }

    init() {
        // Build image paths array
        for (let i = 1; i <= this.galleryImageCount; i++) {
            this.imagePaths.push(`assets/images/gallery/gallery${i}.jpeg`);
        }
        
        this.renderGallery();
        this.startAnimation();
    }

    /**
     * Get a random image path
     */
    getRandomImage() {
        return this.imagePaths[Math.floor(Math.random() * this.imagePaths.length)];
    }

    /**
     * Create a new gallery item element
     */
    createGalleryItem(imagePath) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${imagePath}" alt="Lymina gallery image" loading="lazy">`;
        return div;
    }

    /**
     * Initialize gallery with random images
     */
    renderGallery() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;

        // Clear existing content
        galleryTrack.innerHTML = '';

        // Add initial random images
        for (let i = 0; i < this.minImages; i++) {
            const item = this.createGalleryItem(this.getRandomImage());
            galleryTrack.appendChild(item);
        }

        // Set image width once first image loads
        const firstImg = galleryTrack.querySelector('img');
        if (firstImg) {
            firstImg.onload = () => {
                this.imageWidth = firstImg.parentElement.offsetWidth;
            };
        }
    }

    /**
     * Start the animation loop
     */
    startAnimation() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;

        const animate = () => {
            const now = Date.now();
            const deltaTime = (now - this.lastScrollTime) / 1000; // Convert to seconds
            this.lastScrollTime = now;

            // Update offset
            this.currentOffset += this.scrollSpeed * deltaTime;

            // Apply transform
            galleryTrack.style.transform = `translateX(-${this.currentOffset}px)`;

            // Check if we need to add/remove images
            this.manageImages(galleryTrack);

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * Manage adding and removing images dynamically
     */
    manageImages(galleryTrack) {
        if (!this.imageWidth) {
            // Wait for image width to be set
            const firstImg = galleryTrack.querySelector('img');
            if (firstImg && firstImg.complete) {
                this.imageWidth = firstImg.parentElement.offsetWidth;
            }
            return;
        }

        const items = galleryTrack.children;
        
        // Remove images that have scrolled off screen (left side)
        while (items.length > this.minImages && this.currentOffset > this.imageWidth) {
            galleryTrack.removeChild(items[0]);
            this.currentOffset -= this.imageWidth;
        }

        // Add new images to the right if needed
        const totalWidth = items.length * this.imageWidth;
        const viewportWidth = window.innerWidth;
        
        while (totalWidth - this.currentOffset < viewportWidth + this.imageWidth * 3) {
            const newItem = this.createGalleryItem(this.getRandomImage());
            galleryTrack.appendChild(newItem);
            
            // Update totalWidth calculation
            const updatedTotalWidth = galleryTrack.children.length * this.imageWidth;
            if (updatedTotalWidth <= totalWidth) break; // Prevent infinite loop
        }
    }

    /**
     * Stop the animation
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    // Method to update gallery image count
    setImageCount(count) {
        this.galleryImageCount = count;
        this.imagePaths = [];
        for (let i = 1; i <= count; i++) {
            this.imagePaths.push(`assets/images/gallery/gallery${i}.jpeg`);
        }
        this.stopAnimation();
        this.currentOffset = 0;
        this.lastScrollTime = Date.now();
        this.renderGallery();
        this.startAnimation();
    }
}

// Export for use in main.js
window.GalleryHandler = GalleryHandler;
