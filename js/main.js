/**
 * Main.js - LYMINA Band Website
 * Coordinates all website functionality by initializing modular handlers
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize All Handlers ---
    
    // Background and visual effects
    const backgroundHandler = new window.BackgroundHandler();
    // Make available globally for debugging
    window.backgroundHandler = backgroundHandler;
    const logoHandler = new window.LogoHandler();
    const animationHandler = new window.AnimationHandler();
    
    // UI Components
    const socialBarHandler = new window.SocialBarHandler();
    const tourHandler = new window.TourHandler();
    const galleryHandler = new window.GalleryHandler();
    const merchHandler = new window.MerchHandler();

    // Initialize all handlers
    backgroundHandler.init();
    logoHandler.init();
    animationHandler.init();
    socialBarHandler.init();
    tourHandler.init();
    galleryHandler.init();
    merchHandler.init();

    console.log('LYMINA website initialized successfully!');
});