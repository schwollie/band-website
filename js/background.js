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

        // Pop-style background color properties - read from CSS variables
        this.popBabyBlue = null;
        this.popHotRed = null;
        this.colorChangeThreshold = 300;

        this.init();
    }

    init() {
        // Get colors from CSS custom properties
        this.loadColorsFromCSS();
        
        // Start handling scroll events
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Trigger initial scroll handling on load
        this.handleScroll();
    }

    /**
     * Load color values from CSS custom properties
     */
    loadColorsFromCSS() {
        const root = document.documentElement;
        const computedStyles = getComputedStyle(root);
        
        this.popBabyBlue = computedStyles.getPropertyValue('--pop-baby-blue').trim();
        this.popHotRed = computedStyles.getPropertyValue('--pop-hot-red').trim();
        
        // Also get threshold if defined in CSS, otherwise use default
        const cssThreshold = computedStyles.getPropertyValue('--bg-color-change-threshold').trim();
        if (cssThreshold) {
            this.colorChangeThreshold = parseInt(cssThreshold.replace('px', ''));
        }
    }

    /**
     * Helper function for smooth interpolation
     */
    interpolate(start, end, scrollY, scrollThreshold) {
        return start + (end - start) * Math.sin(Math.min(1, scrollY / scrollThreshold) * (Math.PI / 2));
    }

    handleScroll() {
        const sun = document.querySelector('.sun-image');
        const body = document.body;
        const scrollY = window.scrollY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // --- Pop-style Background Color Change ---
        this.handleBackgroundColorChange(scrollY);

        // --- Sun Parallax ---
        if (sun) {
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

    /**
     * Handles the pop-style background color change on scroll
     */
    handleBackgroundColorChange(scrollY) {
        const body = document.body;
        
        if (scrollY < this.colorChangeThreshold) {
            // At the top - bright baby blue
            body.style.backgroundColor = this.popBabyBlue;
        } else {
            // Calculate transition progress (0 to 1)
            const progress = Math.min(1, (scrollY - this.colorChangeThreshold) / 500);
            
            // Interpolate between baby blue and hot red
            const blueToRed = this.interpolateColor(this.popBabyBlue, this.popHotRed, progress);
            body.style.backgroundColor = blueToRed;
        }
    }

    /**
     * Interpolates between two hex colors
     */
    interpolateColor(color1, color2, factor) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Converts hex color to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

// Export for use in main.js
window.BackgroundHandler = BackgroundHandler;
