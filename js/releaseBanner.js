/**
 * Release Banner Handler
 * Shows countdown to release or "now available" after release
 */

class ReleaseBannerHandler {
    constructor() {
        // === CONFIGURE HERE ===
        this.enabled = true;
        this.releaseName = "Holidays in Space";
        this.releaseDate = new Date("2026-01-29T23:59:59");
        this.presaveLink = "https://distrokid.com/hyperfollow/lymina/holidays-in-space";
        this.spotifyLink = "https://open.spotify.com/intl-de/album/4CBedgTKN560NCtwG4ac3p?si=3VMMWM-WQb2DsnKzBbGtXA";
        // ======================
    }

    init() {
        if (!this.enabled) return;
        this.createBanner();
        this.update();
        setInterval(() => this.update(), 1000);
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    }

    handleScroll() {
        const footer = document.querySelector('footer');
        if (!footer) return;
        
        const footerTop = footer.getBoundingClientRect().top;
        const bannerHeight = this.banner.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Distance from banner (at bottom of viewport) to footer
        const distanceToFooter = footerTop - viewportHeight;
        const fadeDistance = 150; // Start fading 150px before footer
        
        if (distanceToFooter <= 0) {
            // Banner has reached or passed the footer - hide completely
            this.banner.style.opacity = 0;
            this.banner.style.pointerEvents = 'none';
            this.banner.style.visibility = 'hidden';
        } else if (distanceToFooter < fadeDistance) {
            // Fade out as approaching footer
            const opacity = distanceToFooter / fadeDistance;
            this.banner.style.opacity = opacity;
            this.banner.style.pointerEvents = 'none';
            this.banner.style.visibility = 'visible';
        } else {
            // Above footer - fully visible and clickable
            this.banner.style.opacity = 1;
            this.banner.style.pointerEvents = 'auto';
            this.banner.style.visibility = 'visible';
        }
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.className = 'release-banner';
        banner.innerHTML = `
            <span class="release-text"></span>
            <a class="release-link" href="#" target="_blank"></a>
        `;
        document.body.insertBefore(banner, document.body.firstChild);
        this.banner = banner;
    }

    update() {
        const now = new Date();
        const diff = this.releaseDate - now;
        const text = this.banner.querySelector('.release-text');
        const link = this.banner.querySelector('.release-link');

        if (diff > 0) {
            // Countdown mode
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            
            text.textContent = `${this.releaseName} in ${d}d ${h}h ${m}m ${s}s`;
            link.textContent = "Pre-Save";
            link.href = this.presaveLink;
        } else {
            // Released mode
            text.textContent = `${this.releaseName} jetzt erhältlich!`;
            link.textContent = "Jetzt anhören";
            link.href = this.spotifyLink;
        }
    }
}

window.ReleaseBannerHandler = ReleaseBannerHandler;
