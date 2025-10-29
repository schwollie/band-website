/**
 * Gallery Handler
 * Ping-pong scroll (left-to-right, then right-to-left)
 */

class GalleryHandler {
    constructor() {
        this.galleryImageCount = 9; // Set this to the number of gallery images you have
        this.imagePaths = [];
        this.secondsPerImage = 8; // Time in seconds to scroll one image width (default: 2 seconds)
        this.lastScrollTime = Date.now();
        this.currentOffset = 0; // Current scroll offset in pixels
        this.imageWidth = 0; // Average image width for speed calculation
        this.totalGalleryWidth = 0; // Actual total width of all images including padding
        this.animationId = null;
        this.shuffledImages = []; // Shuffled image sequence (no duplicates)
        this.direction = 1; // 1 for right, -1 for left
        this.edgePadding = 50; // Padding for first and last image (in pixels)
        
        // Manual scroll properties
        this.isManualScrolling = false;
        this.isDragging = false;
        this.startX = 0;
        this.startOffset = 0;
        this.lastInteractionTime = 0;
        this.autoScrollDelay = 3000; // Resume auto-scroll after 3 seconds of inactivity
    }

    init() {
        // Build image paths array
        for (let i = 1; i <= this.galleryImageCount; i++) {
            this.imagePaths.push(`assets/images/gallery/galery${i}.jpg`);
        }
        
        // Adjust speed for mobile devices
        if (window.innerWidth <= 768 && window.innerHeight > window.innerWidth) {
            // Portrait mode: slowest
            this.secondsPerImage = 8;
        } else if (window.innerWidth <= 768) {
            // Mobile landscape: medium
            this.secondsPerImage = 4;
        } else {
            // Desktop: default (from constructor)
            // this.secondsPerImage already set
        }
        
        // Create a shuffled sequence (random order, no duplicates)
        this.createShuffledSequence();
        
        this.renderGallery();
        this.setupManualScrolling();
        // Recalculate dimensions on resize and clamp offset
        window.addEventListener('resize', () => {
            this.calculateGalleryDimensions();
            this.clampOffsetAndApply();
        });
        this.startAnimation();
    }

    /**
     * Create a shuffled sequence of images (Fisher-Yates shuffle)
     * Uses each image exactly once in random order
     */
    createShuffledSequence() {
        // Copy the original array
        this.shuffledImages = [...this.imagePaths];
        
        // Fisher-Yates shuffle algorithm
        for (let i = this.shuffledImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledImages[i], this.shuffledImages[j]] = [this.shuffledImages[j], this.shuffledImages[i]];
        }
    }

    /**
     * Get image by index
     */
    getImageByIndex(index) {
        if (index < 0 || index >= this.shuffledImages.length) return null;
        return this.shuffledImages[index];
    }

    /**
     * Create a new gallery item element
     */
    createGalleryItem(imagePath, index) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        
        // Add padding classes for first and last images
        if (index === 0) {
            div.classList.add('gallery-item-first');
            div.style.paddingLeft = `${this.edgePadding}px`;
        } else if (index === this.shuffledImages.length - 1) {
            div.classList.add('gallery-item-last');
            div.style.paddingRight = `${this.edgePadding}px`;
        }
        
        div.innerHTML = `<img src="${imagePath}" alt="Lymina galery image" loading="lazy">`;
        return div;
    }

    /**
     * Get the visible width of the gallery viewport (container)
     */
    getViewportWidth() {
        const container = document.querySelector('.gallery-scroll-container');
        return container ? container.clientWidth : window.innerWidth;
    }

    /**
     * Initialize gallery with images
     */
    renderGallery() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;

        // Clear existing content
        galleryTrack.innerHTML = '';

        // Add all images to the track
        for (let i = 0; i < this.shuffledImages.length; i++) {
            const imagePath = this.shuffledImages[i];
            const item = this.createGalleryItem(imagePath, i);
            galleryTrack.appendChild(item);
        }

        // Start animation immediately (even if images are not loaded)
        // Calculate initial dimensions (may be rough)
        this.calculateGalleryDimensions();
        this.clampOffsetAndApply();
        // Animation is started in init(), so do not start again here
        // As images load, dimensions will be updated
    }

    /**
     * Calculate actual gallery dimensions
     */
    calculateGalleryDimensions() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;

        const items = galleryTrack.querySelectorAll('.gallery-item');
        if (items.length === 0) return;

        const images = galleryTrack.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = images.length;

        const calculateWhenReady = () => {
            const totalWidth = galleryTrack.scrollWidth;
            const count = items.length;
            const avgWidth = (totalWidth - (2 * this.edgePadding)) / Math.max(1, count);
            this.totalGalleryWidth = totalWidth;
            this.imageWidth = avgWidth;
            this.clampOffsetAndApply();
        };

        // As each image loads, recalculate dimensions
        images.forEach(img => {
            img.onload = () => {
                loadedCount++;
                calculateWhenReady();
            };
        });
        // Also calculate once at the start (in case some images are cached or load instantly)
        setTimeout(calculateWhenReady, 10);
    }

    /**
     * Clamp currentOffset to valid range and apply transform
     * (Always allow ping-pong scroll, even if gallery is smaller than viewport)
     */
    clampOffsetAndApply() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;
        const viewportWidth = this.getViewportWidth();
        const totalWidth = this.totalGalleryWidth > 0
            ? this.totalGalleryWidth
            : (this.shuffledImages.length * this.imageWidth + (2 * this.edgePadding));
        // Always allow at least edge padding scroll, even if gallery is smaller than viewport
        let minOffset = -this.edgePadding;
        let maxOffset = totalWidth - viewportWidth;
        if (maxOffset < minOffset) maxOffset = minOffset;
        this.currentOffset = Math.max(minOffset, Math.min(maxOffset, this.currentOffset));
        galleryTrack.style.transform = `translateX(-${this.currentOffset}px)`;
    }

    /**
     * Setup manual scrolling with mouse/touch events
     * (DISABLED: Only auto-scroll is allowed)
     */
    setupManualScrolling() {
        const galleryContainer = document.querySelector('.gallery-scroll-container');
        if (!galleryContainer) return;

        // Disable all pointer, mouse, and touch event listeners for manual scroll/drag
        // Only auto-scroll is active

        // Prevent image dragging
        galleryContainer.addEventListener('dragstart', (e) => e.preventDefault());

        // Set touch-action to pan-y to allow vertical page scroll, block horizontal drag
        try {
            galleryContainer.style.touchAction = 'pan-y'; // modern browsers
            // @ts-ignore
            galleryContainer.style.msTouchAction = 'pan-y'; // IE/old Edge
        } catch {}

        // Set cursor to default (no grab/drag)
        galleryContainer.style.cursor = 'default';
    }

    /**
     * Start the animation loop
     */
    startAnimation() {
        const galleryTrack = document.querySelector('.gallery-track');
        if (!galleryTrack) return;

        const animate = () => {
            const now = Date.now();

            // Only auto-scroll if not manually scrolling
            if (!this.isManualScrolling && !this.isDragging) {
                const deltaTime = (now - this.lastScrollTime) / 1000; // seconds
                const scrollSpeed = this.imageWidth > 0 ? this.imageWidth / this.secondsPerImage : 0;
                this.currentOffset += scrollSpeed * deltaTime * this.direction;

                const viewportWidth = this.getViewportWidth();
                const totalWidth = this.totalGalleryWidth > 0
                    ? this.totalGalleryWidth
                    : (this.shuffledImages.length * this.imageWidth + (2 * this.edgePadding));
                // Always allow at least edge padding scroll, even if gallery is smaller than viewport
                let minOffset = -this.edgePadding;
                let maxOffset = totalWidth - viewportWidth;
                if (maxOffset < minOffset) maxOffset = minOffset;

                // Check if we've reached the end and reverse direction
                if (this.currentOffset >= maxOffset && this.direction === 1) {
                    this.currentOffset = maxOffset;
                    this.direction = -1;
                } else if (this.currentOffset <= minOffset && this.direction === -1) {
                    this.currentOffset = minOffset;
                    this.direction = 1;
                }

                galleryTrack.style.transform = `translateX(-${this.currentOffset}px)`;
            }

            this.lastScrollTime = now;
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
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

    /**
     * Set the scroll speed in seconds per image
     */
    setScrollSpeed(secondsPerImage) {
        this.secondsPerImage = secondsPerImage;
    }

    // Method to update gallery image count
    setImageCount(count) {
        this.galleryImageCount = count;
        this.imagePaths = [];
        for (let i = 1; i <= count; i++) {
            this.imagePaths.push(`assets/images/gallery/galery${i}.jpg`);
        }
        this.createShuffledSequence();
        this.stopAnimation();
        this.currentOffset = 0;
        this.direction = 1;
        this.isManualScrolling = false;
        this.isDragging = false;
        this.totalGalleryWidth = 0; // Reset calculated width
        this.lastScrollTime = Date.now();
        this.renderGallery();
        this.setupManualScrolling();
        this.startAnimation();
    }
}

// Export for use in main.js
window.GalleryHandler = GalleryHandler;
