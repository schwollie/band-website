/**
 * Main.js - LYMINA Band Website
 * Coordinates all website functionality by initializing modular handlers
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize All Handlers ---
    
    // Background and visual effects (includes sun, logo, clouds, grain)
    const backgroundHandler = new window.BackgroundHandler();
    // Make available globally for debugging
    window.backgroundHandler = backgroundHandler;
    const animationHandler = new window.AnimationHandler();
    
    // UI Components
    const socialBarHandler = new window.SocialBarHandler();
    const tourHandler = new window.TourHandler();
    const galleryHandler = new window.GalleryHandler();
    const merchHandler = new window.MerchHandler();
    const releaseBannerHandler = new window.ReleaseBannerHandler();

    // Initialize all handlers (BackgroundHandler auto-inits in constructor)
    animationHandler.init();
    socialBarHandler.init();
    tourHandler.init();
    galleryHandler.init();
    merchHandler.init();
    releaseBannerHandler.init();

    console.log('LYMINA website initialized successfully!');
});