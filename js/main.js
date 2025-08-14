/**
 * Main.js - LYMINA Band Website
 * Coordinates all website functionality by initializing modular handlers
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- Supabase Configuration ---
    const SUPABASE_URL = "https://dolezrdzoqerqebusxft.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvbGV6cmR6b3FlcnFlYnVzeGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjQwNDIsImV4cCI6MjA2NjEwMDA0Mn0.TmEcK9Q5bnd4k0dzd-wny1D09rZxWJL_iWVvNlQ10J8";
    
    // Initialize Supabase client
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- Initialize All Handlers ---
    
    // Background and visual effects
    const backgroundHandler = new window.BackgroundHandler();
    const logoHandler = new window.LogoHandler();
    const animationHandler = new window.AnimationHandler();
    
    // UI Components
    const socialBarHandler = new window.SocialBarHandler();
    const tourHandler = new window.TourHandler();
    const galleryHandler = new window.GalleryHandler();
    const newsletterHandler = new window.NewsletterHandler(supabase);
    const merchHandler = new window.MerchHandler();

    // Initialize all handlers
    backgroundHandler.init();
    logoHandler.init();
    animationHandler.init();
    socialBarHandler.init();
    tourHandler.init();
    galleryHandler.init();
    newsletterHandler.init();
    merchHandler.init();

    console.log('LYMINA website initialized successfully!');
});