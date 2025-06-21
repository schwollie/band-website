document.addEventListener('DOMContentLoaded', () => {

    // --- Social Bar Scroll Logic ---
    const socialBar = document.querySelector('.social-bar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // If scrolling down past the header, hide the bar
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            socialBar.classList.add('social-bar--hidden');
        } 
        // If scrolling up, only show the bar if we are near the top
        else if (currentScrollY < lastScrollY) {
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
        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    }, { passive: true });


    // --- Animate Sections on Scroll ---
    const observer = new IntersectionObserver((entries) => {
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

    // Observe all sections
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => observer.observe(section));


    // --- Configuration ---
    const GALLERY_IMAGE_COUNT = 5; // Set this to the number of gallery images you have

    // --- Data for Dynamic Content ---
    const tourDates = [
        { date: "JUL 25, 2025", venue: "The Sunnyvale", location: "Austin, TX", soldOut: false },
        { date: "AUG 12, 2025", venue: "The Root Cellar", location: "Kingston, JM", soldOut: false },
        { date: "SEP 05, 2025", venue: "Beachside Tavern", location: "San Diego, CA", soldOut: true },
        { date: "OCT 19, 2025", venue: "The Folk Fest", location: "Asheville, NC", soldOut: false },
    ];

    // --- Parallax Scroll Effect ---
    // Sun properties
    const sunInitialScale = 2.5;
    const sunMaxScale = 3.5;
    const sunWobbleAmplitude = 0.01; // Percentage of viewport width
    const sunWobbleSpeed = 1000;

    // Logo properties
    const logoStartX = 0.005; // Percentage of viewport width
    const logoStartY = 0.15; // Percentage of viewport height
    const logoStartScale = 1.7;
    const logoScrollFactor = 0.5;
    const logoOpacityStart = 0.95;
    const logoOpacityEnd = 0.0;

    function handleScroll() {
        const sun = document.querySelector('.sun-image');
        const nameLogo = document.querySelector('.band-logo');
        if (!sun || !nameLogo) return;

        const scrollY = window.scrollY;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // --- Sun Parallax ---
        // Scaling
        let scale = sunInitialScale + (sunMaxScale - sunInitialScale) * Math.sin(Math.min(1, scrollY / 500) * (Math.PI / 2));
        scale = Math.min(scale, sunMaxScale);

        // Wobble effect
        const sunX = Math.sin(scrollY / sunWobbleSpeed) * sunWobbleAmplitude * viewportWidth;
        const sunY = Math.cos(scrollY / sunWobbleSpeed) * sunWobbleAmplitude * viewportWidth;

        sun.style.transform = `translate(${sunX}px, ${sunY}px) scale(${scale})`;

        // --- Logo Parallax ---
        // Opacity
        let opacity = logoOpacityStart - (logoOpacityStart - logoOpacityEnd) * Math.sin(Math.min(1, scrollY / 500) * (Math.PI / 2));
        opacity = Math.max(opacity, logoOpacityEnd);
        nameLogo.style.opacity = opacity;

        // Position
        const logoTranslateY = logoStartY * viewportHeight - scrollY * logoScrollFactor;
        const logoTranslateX = logoStartX * viewportWidth;
        nameLogo.style.transform = `translateY(${logoTranslateY}px) translateX(${logoTranslateX}px) scale(${logoStartScale})`;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger handleScroll on initial load
    handleScroll();


    // --- Dynamic Content Rendering ---
    function renderTourDates() {
        const showList = document.querySelector('.show-list');
        if (!showList) return;
        showList.innerHTML = tourDates.map(show => `
            <li>
                <span class="date">${show.date}</span>
                <span class="venue">${show.venue}</span>
                <span class="location">${show.location}</span>
                <a href="#" class="ticket-btn ${show.soldOut ? 'sold-out' : ''}">
                    ${show.soldOut ? 'Sold Out' : 'Get Tickets'}
                </a>
            </li>
        `).join('');
    }

    /**
     * Shuffles array in place.
     * @param {Array} array items An array containing the items.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Automatically generates gallery images in a random order.
     */
    function renderGallery() {
        const slidesWrapper = document.querySelector('.slides-wrapper');
        if (!slidesWrapper) return;

        let imagePaths = [];
        for (let i = 1; i <= GALLERY_IMAGE_COUNT; i++) {
            imagePaths.push(`assets/images/gallery/gallery${i}.jpeg`);
        }

        shuffleArray(imagePaths); // Randomize the image order

        const galleryHTML = imagePaths.map(path => `
            <div class="slide">
                <img src="${path}" alt="Lymina gallery image">
            </div>
        `).join('');
        
        slidesWrapper.innerHTML = galleryHTML;
    }

    // --- Slideshow Logic ---
    let slideIndex = 0;
    let autoPlayInterval = null; // To hold the reference to setInterval
    
    function setupSlideshow() {
        const slidesWrapper = document.querySelector('.slides-wrapper');
        const slides = document.querySelectorAll('.slide');
        const prevButton = document.querySelector(".slideshow-container .prev");
        const nextButton = document.querySelector(".slideshow-container .next");

        if (!slidesWrapper || slides.length === 0) return;

        function showSlide(index) {
            if (index >= slides.length) slideIndex = 0;
            else if (index < 0) slideIndex = slides.length - 1;
            else slideIndex = index;
            
            const offset = -slideIndex * 100;
            slidesWrapper.style.transform = `translateX(${offset}%)`;
        }

        function advanceSlide() {
            showSlide(slideIndex + 1);
        }

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", () => {
                clearInterval(autoPlayInterval); // Stop autoplay on user interaction
                showSlide(slideIndex - 1);
            });
            nextButton.addEventListener("click", () => {
                clearInterval(autoPlayInterval); // Stop autoplay on user interaction
                advanceSlide();
            });
        }

        // Auto-play
        autoPlayInterval = setInterval(advanceSlide, 5000);

        showSlide(slideIndex);
    }


    // --- Newsletter Form Logic --- 
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const emailInput = document.getElementById('email');
            if (emailInput.value && emailInput.checkValidity()) {
                formMessage.textContent = `Thank you! We'll keep you posted.`;
                emailInput.value = '';
            } else {
                formMessage.textContent = 'Please enter a valid email address.';
            }
            setTimeout(() => { formMessage.textContent = ''; }, 5000);
        });
    }

    // --- Initialize Page ---
    renderTourDates();
    renderGallery();
    // We need to wait for images to be added to the DOM before setting up the slideshow
    setTimeout(setupSlideshow, 0);
});