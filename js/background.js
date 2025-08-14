/**
 * Background Effects Handler
 * Manages sun parallax, background colors, and future cloud effects
 */

class BackgroundHandler {
    constructor() {
        // Sun properties
        this.sunInitialScale = 2.5;
        this.sunMaxScale = 3.5;
        this.sunWobbleAmplitudeX = 0.01; // Percentage of viewport width
        this.sunWobbleSpeedX = 1000;
        this.sunWobbleAmplitudeY = 0.03; // Percentage of viewport width
        this.sunWobbleSpeedY = 650;
        this.sunUpMovement = 0.02; // Percentage of viewport height

        this.init();
    }

    init() {
        // Start handling scroll events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Trigger initial scroll handling on load
        this.handleScroll();
    }

    /**
     * Helper function for smooth interpolation
     */
    interpolate(start, end, scrollY, scrollThreshold) {
        return start + (end - start) * Math.sin(Math.min(1, scrollY / scrollThreshold) * (Math.PI / 2));
    }

    handleScroll() {
        const sun = document.querySelector('.sun-image');
        if (!sun) return;

        const scrollY = window.scrollY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // --- Sun Parallax ---
        // Scaling
        let scale = this.interpolate(this.sunInitialScale, this.sunMaxScale, scrollY, 500);
        scale = Math.min(scale, this.sunMaxScale);

        // Wobble effect
        const sunX = Math.sin(scrollY / this.sunWobbleSpeedX) * this.sunWobbleAmplitudeX * viewportWidth;
        const sunY = Math.cos(scrollY / this.sunWobbleSpeedY) * this.sunWobbleAmplitudeY * viewportWidth;

        // Upward movement
        const sunMovementY = (-500 / (scrollY + 100) + 5) * this.sunUpMovement * viewportHeight;

        sun.style.transform = `translate(${sunX}px, ${sunY + sunMovementY}px) scale(${scale})`;
    }
}

// Export for use in main.js
window.BackgroundHandler = BackgroundHandler;
