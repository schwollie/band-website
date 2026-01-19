/**
 * Logo Handler
 * Manages the band logo parallax effects and animations
 */

// DEPRECATED: This class is now integrated into BackgroundHandler in background.js
// Keeping this file for reference but the class is renamed to avoid conflicts
class LogoHandlerLegacy {
    constructor() {
        // Logo properties
        this.logoStartX = 0.005; // Percentage of viewport width
        this.logoStartY = 0.15; // Percentage of viewport height
        this.logoStartScale = 1.7;
        this.logoEndScale = 2.5;
        this.logoScrollFactor = 0.5;
        this.logoOpacityStart = 0.95;
        this.logoOpacityEnd = 0.0;

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
        const nameLogo = document.querySelector('.band-logo');
        if (!nameLogo) return;

        const scrollY = window.scrollY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // --- Logo Parallax ---
        // Scaling
        let scaleLogo = this.interpolate(this.logoStartScale, this.logoEndScale, scrollY, 500);
        scaleLogo = Math.min(scaleLogo, this.logoEndScale);

        // Opacity
        let opacity = this.interpolate(this.logoOpacityStart, this.logoOpacityEnd, scrollY, 500);
        opacity = Math.max(opacity, this.logoOpacityEnd);
        nameLogo.style.opacity = opacity;

        // Position
        const logoTranslateY = this.logoStartY * viewportHeight - scrollY * this.logoScrollFactor;
        const logoTranslateX = this.logoStartX * viewportWidth;
        nameLogo.style.transform = `translateY(${logoTranslateY}px) translateX(${logoTranslateX}px) scale(${scaleLogo})`;
    }
}

// LogoHandler is now part of BackgroundHandler - this file is deprecated
// window.LogoHandler = LogoHandler;
