/**
 * Social Bar Handler
 * Manages the social media bar auto-hide functionality
 */

class SocialBarHandler {
    constructor() {
        this.lastScrollY = window.scrollY;
    }

    init() {
        const socialBar = document.querySelector('.social-bar');
        if (!socialBar) return;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // If scrolling down past the header, hide the bar
            if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                socialBar.classList.add('social-bar--hidden');
            }
            // If scrolling up, only show the bar if we are near the top
            else if (currentScrollY < this.lastScrollY) {
                // The bar will only reappear if you scroll up into the top 300px of the page
                if (currentScrollY < 300) {
                    socialBar.classList.remove('social-bar--hidden');
                }
            }
            // Always ensure the bar is visible when at the very top of the page
            if (currentScrollY < 10) {
                socialBar.classList.remove('social-bar--hidden');
            }

            // Update last scroll position for the next event
            this.lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        }, { passive: true });
    }
}

// Export for use in main.js
window.SocialBarHandler = SocialBarHandler;
