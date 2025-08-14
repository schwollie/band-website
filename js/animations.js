/**
 * Animation Handler
 * Manages scroll-based animations for sections
 */

class AnimationHandler {
    constructor() {
        this.observer = null;
    }

    init() {
        this.setupIntersectionObserver();
        this.observeSections();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Add class if intersecting, remove it if not
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the section is visible
        });
    }

    observeSections() {
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => this.observer.observe(section));
    }

    // Method to observe additional elements in the future
    observeElement(element) {
        if (this.observer && element) {
            this.observer.observe(element);
        }
    }
}

// Export for use in main.js
window.AnimationHandler = AnimationHandler;
