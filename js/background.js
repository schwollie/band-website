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

        // Grain/noise effect properties
        this.grainEnabled = true;
        this.grainVideoSpeed = 0.24; // Playback speed for video grain (0.1-1.0)

        this.init();
    }

    init() {
        // Get colors from CSS custom properties
        this.loadColorsFromCSS();
        
        // Apply static grain effect
        if (this.grainEnabled) {
            this.applyGrainEffect();
        }
        
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

    /**
     * Applies grain effect (static SVG fallback + MP4 video when loaded)
     */
    applyGrainEffect() {
        // Static grain fallback (keeps exactly same implementation)
        //const grain = document.createElement('div');
        //grain.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100vh;pointer-events:none;z-index:-1;opacity:0.10;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.4' numOctaves='1'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0.8 0.8 1'/%3E%3C/feComponentTransfer%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
        //document.body.appendChild(grain);
        
        // Try to load MP4 film grain
        const v = document.createElement('video');
        v.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);min-width:100%;min-height:100%;width:auto;height:auto;object-fit:cover;pointer-events:none;z-index:-1;opacity:0.2;mix-blend-mode:screen`;
        v.muted = v.loop = v.playsInline = true;
        
        v.oncanplaythrough = () => {
            v.playbackRate = this.grainVideoSpeed;
            v.play().then(() => grain.remove()).catch(() => {});
        };
        
        v.onerror = () => v.remove();
        v.src = 'assets/videos/film-grain.mp4';
        document.body.appendChild(v);
    }
}

// Export for use in main.js
window.BackgroundHandler = BackgroundHandler;
