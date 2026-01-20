/**
 * Release Banner Handler
 * Shows countdown to release or "now available" after release
 */

class ReleaseBannerHandler {
    constructor() {
        // === CONFIGURE HERE ===
        this.enabled = true;
        this.releaseName = "Holidays in Space";
        this.releaseDate = new Date("2026-01-30T23:59:59");
        this.presaveLink = "https://distrokid.com/hyperfollow/lymina/holidays-in-space";
        this.spotifyLink = "https://open.spotify.com/track/your-track-id";
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
        const scrollBottom = window.scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const distanceFromBottom = docHeight - scrollBottom;
        
        // Fade out when within 350px of bottom
        if (distanceFromBottom < 350) {
            this.banner.style.opacity = distanceFromBottom / 350;
        } else {
            this.banner.style.opacity = 1;
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
