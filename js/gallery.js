/**
 * Gallery Handler
 * Manages the gallery slideshow functionality
 */

class GalleryHandler {
    constructor() {
        this.galleryImageCount = 5; // Set this to the number of gallery images you have
        this.slideIndex = 0;
        this.autoPlayInterval = null;
    }

    init() {
        this.renderGallery();
        // We need to wait for images to be added to the DOM before setting up the slideshow
        setTimeout(() => this.setupSlideshow(), 0);
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
     * Automatically generates gallery images in a random order.
     */
    renderGallery() {
        const slidesWrapper = document.querySelector('.slides-wrapper');
        if (!slidesWrapper) return;

        let imagePaths = [];
        for (let i = 1; i <= this.galleryImageCount; i++) {
            imagePaths.push(`assets/images/gallery/gallery${i}.jpeg`);
        }

        this.shuffleArray(imagePaths); // Randomize the image order

        const galleryHTML = imagePaths.map(path => `
            <div class="slide">
                <img src="${path}" alt="Lymina gallery image">
            </div>
        `).join('');

        slidesWrapper.innerHTML = galleryHTML;
    }

    setupSlideshow() {
        const slidesWrapper = document.querySelector('.slides-wrapper');
        const slides = document.querySelectorAll('.slide');
        const prevButton = document.querySelector(".slideshow-container .prev");
        const nextButton = document.querySelector(".slideshow-container .next");

        if (!slidesWrapper || slides.length === 0) return;

        const showSlide = (index) => {
            if (index >= slides.length) this.slideIndex = 0;
            else if (index < 0) this.slideIndex = slides.length - 1;
            else this.slideIndex = index;

            const offset = -this.slideIndex * 100;
            slidesWrapper.style.transform = `translateX(${offset}%)`;
        };

        const advanceSlide = () => {
            showSlide(this.slideIndex + 1);
        };

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", () => {
                clearInterval(this.autoPlayInterval); // Stop autoplay on user interaction
                showSlide(this.slideIndex - 1);
            });
            nextButton.addEventListener("click", () => {
                clearInterval(this.autoPlayInterval); // Stop autoplay on user interaction
                advanceSlide();
            });
        }

        // Auto-play
        this.autoPlayInterval = setInterval(advanceSlide, 5000);

        showSlide(this.slideIndex);
    }

    // Method to update gallery image count
    setImageCount(count) {
        this.galleryImageCount = count;
        this.renderGallery();
        setTimeout(() => this.setupSlideshow(), 0);
    }
}

// Export for use in main.js
window.GalleryHandler = GalleryHandler;
