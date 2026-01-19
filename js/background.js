/**
 * Background Effects Handler
 * Manages sun parallax, background colors, and cloud effects
 */

/**
 * CloudSystem - Manages cloud generation, positioning, and animation
 */
class CloudSystem {
    constructor(fadeInDuration = 5) {
        this.fadeInDuration = fadeInDuration; // Fade-in duration in seconds
        this.baseSize = 0.02;              // Base cloud size relative to viewport width
        this.sizeVariation = 0.0005;       // Size variation
        this.cloudDensity = 0.001;          // Clouds per 100px of width
        this.seed = 38;
        this.minDistance = 15;             // Min distance in viewport % 
        this.sunExclusionRadius = 22;      // Sun exclusion radius in viewport %
        this.speed = 0.0015;               // Animation speed
        this.wobbleSizeX = 3;            // Wobble amplitude multiplier
        
        this.clouds = [];
        this.time = 0;
        this.animationRunning = false;
        this.lastWidth = window.innerWidth;
    }
    
    // Seeded random generator
    random(seed) {
        const x = Math.sin(seed * 9999) * 10000;
        return x - Math.floor(x);
    }
    
    // Check distance between two points (in viewport %)
    tooClose(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy) < this.minDistance;
    }
    
    async init() {
        const container = document.querySelector('.clouds-container');
        if (!container) return;
        
        container.innerHTML = '';
        this.clouds = [];
        
        // Container already hidden via CSS (opacity: 0)
        // Set transition for slow fade-in
        container.style.transition = `opacity ${this.fadeInDuration}s ease-in`;
        
        let seed = this.seed;
        const positions = [];
        
        // Calculate cloud count based on viewport width
        const cloudCount = Math.max(5, Math.floor(window.innerWidth * this.cloudDensity));
        
        // Generate clouds across full viewport (0-100% x 0-100%)
        for (let i = 0; i < cloudCount; i++) {
            let x, y, attempts = 0;
            
            // Find position that doesn't overlap sun or other clouds
            do {
                x = this.random(seed++) * 100;
                y = 10 + this.random(seed++) * 90; // Keep 10% offset from top
                attempts++;
            } while (attempts < 40 && (
                this.tooClose(x, y, 50, 50) || // Too close to sun at center
                positions.some(p => this.tooClose(x, y, p.x, p.y))
            ));
            
            // Skip if inside sun zone
            if (Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2)) < this.sunExclusionRadius) {
                continue;
            }
            
            positions.push({ x, y });
            
            const img = document.createElement('img');
            img.src = `assets/images/clouds/cloud${1 + Math.floor(this.random(seed++) * 3)}.png`;
            img.className = 'cloud';
            img.style.cssText = `top:${y}%;left:${x}%;transform:translate(-50%,-50%);transform-origin:center;`;
            container.appendChild(img);
            
            const size = this.baseSize + (this.random(seed++) - 0.5) * 2 * this.sizeVariation;
            this.clouds.push({
                el: img,
                size: size,
                parallax: 0.15 + this.random(seed++) * 0.2,
                wobbleAmp: (0.8 + this.random(seed++) * 1.2) * this.wobbleSizeX,
                wobblePhase: this.random(seed++) * Math.PI * 2
            });
        }
        
        // Set up resize handler
        if (!this.resizeHandler) {
            this.resizeHandler = () => {
                const currentWidth = window.innerWidth;
                if (Math.abs(currentWidth - this.lastWidth) > 100) { // Only reinit if width changed by >100px
                    this.lastWidth = currentWidth;
                    this.init();
                }
            };
            window.addEventListener('resize', this.resizeHandler);
        }
        
        // Start animation first to set initial positions
        if (!this.animationRunning) {
            this.animationRunning = true;
            this.update(); // Set initial positions before fade-in
            requestAnimationFrame(() => this.animate());
        }
        
        // Fade in clouds after positions are set
        // Use setTimeout to ensure transition is registered before opacity change
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => setTimeout(resolve, 50));
        container.style.opacity = '1';
    }
    
    animate() {
        this.time += 16;
        this.update();
        requestAnimationFrame(() => this.animate());
    }
    
    update() {
        const scrollY = window.scrollY;
        const vw = Math.min(window.innerWidth, 1400); // Cap at 1400px for cloud sizing
        
        this.clouds.forEach(c => {
            const wobble = Math.sin(this.time * this.speed + c.wobblePhase) * c.wobbleAmp;
            const parallaxY = -scrollY * c.parallax;
            const scale = c.size * vw * 0.01; // Convert size to pixels based on viewport
            const opacity = Math.max(0, 1 - scrollY / 300);
            
            c.el.style.transform = `translate(-50%, -50%) translateX(${wobble}px) translateY(${parallaxY}px) scale(${scale})`;
            c.el.style.opacity = opacity;
        });
    }
}

/**
 * SunParallax - Manages sun animation and parallax effects
 */
class SunParallax {
    constructor(fadeInDuration = 0.4) {
        this.fadeInDuration = fadeInDuration; // Fade-in duration in seconds
        this.element = null;
        this.initialScale = 2.5;
        this.maxScale = 3.5;
        this.wobbleAmplitudeX = 0.01;
        this.wobbleSpeedX = 1000;
        this.wobbleAmplitudeY = 0.03;
        this.wobbleSpeedY = 650;
        this.upMovement = 0.02;
    }
    
    async init() {
        this.element = document.querySelector('.sun-image');
        if (this.element) {
            // Element already hidden via CSS (opacity: 0)
            // Set initial transform to correct position/scale
            this.update(window.scrollY);
            
            // Wait for image to load
            if (!this.element.complete) {
                await new Promise(resolve => {
                    this.element.onload = resolve;
                    this.element.onerror = resolve;
                });
            }
            
            // Add transition and fade in after ensuring position is set
            await new Promise(resolve => requestAnimationFrame(resolve));
            this.element.style.transition = `opacity ${this.fadeInDuration}s ease-in`;
            await new Promise(resolve => setTimeout(resolve, 50));
            this.element.style.opacity = '1';
        }
    }
    
    interpolate(start, end, scrollY, threshold) {
        return start + (end - start) * Math.sin(Math.min(1, scrollY / threshold) * (Math.PI / 2));
    }
    
    update(scrollY) {
        if (!this.element) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let scale = this.interpolate(this.initialScale, this.maxScale, scrollY, 500);
        scale = Math.min(scale, this.maxScale);
        
        const sunX = Math.sin(scrollY / this.wobbleSpeedX) * this.wobbleAmplitudeX * viewportWidth;
        const sunY = Math.cos(scrollY / this.wobbleSpeedY) * this.wobbleAmplitudeY * viewportWidth;
        const sunMovementY = (-500 / (scrollY + 100) + 5) * this.upMovement * viewportHeight;
        
        this.element.style.transform = `translate(${sunX}px, ${sunY + sunMovementY}px) scale(${scale})`;
    }
}

/**
 * BackgroundColor - Manages background color transitions
 */
class BackgroundColor {
    constructor() {
        this.babyBlue = null;
        this.hotRed = null;
        this.changeThreshold = 300;
    }
    
    init() {
        const root = document.documentElement;
        const computedStyles = getComputedStyle(root);
        
        this.babyBlue = computedStyles.getPropertyValue('--pop-baby-blue').trim();
        this.hotRed = computedStyles.getPropertyValue('--pop-hot-red').trim();
        
        const cssThreshold = computedStyles.getPropertyValue('--bg-color-change-threshold').trim();
        if (cssThreshold) {
            this.changeThreshold = parseInt(cssThreshold.replace('px', ''));
        }
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    interpolateColor(color1, color2, factor) {
        const c1 = this.hexToRgb(color1);
        const c2 = this.hexToRgb(color2);
        
        const r = Math.round(c1.r + (c2.r - c1.r) * factor);
        const g = Math.round(c1.g + (c2.g - c1.g) * factor);
        const b = Math.round(c1.b + (c2.b - c1.b) * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    update(scrollY) {
        const body = document.body;
        
        if (scrollY < this.changeThreshold) {
            body.style.backgroundColor = this.babyBlue;
        } else {
            const progress = Math.min(1, (scrollY - this.changeThreshold) / 500);
            const blueToRed = this.interpolateColor(this.babyBlue, this.hotRed, progress);
            body.style.backgroundColor = blueToRed;
        }
    }
}

/**
 * LogoHandler - Manages band logo parallax effects and fade-in
 */
class LogoHandler {
    constructor(fadeInDuration = 0.4) {
        this.fadeInDuration = fadeInDuration; // Fade-in duration in seconds
        this.element = null;
        this.logoStartX = 0.005;
        this.logoStartY = 0.15;
        this.logoStartScale = 1.7;
        this.logoEndScale = 2.5;
        this.logoScrollFactor = 0.5;
        this.logoOpacityStart = 0.95;
        this.logoOpacityEnd = 0.0;
        this.loaded = false;
        this.fadeInComplete = false; // Track if fade-in animation is done
    }
    
    async init() {
        this.element = document.querySelector('.band-logo');
        if (this.element) {
            // Element already hidden via CSS (opacity: 0)
            
            // Wait for image to load
            if (!this.element.complete) {
                await new Promise(resolve => {
                    this.element.onload = resolve;
                    this.element.onerror = resolve;
                });
            }
            
            this.loaded = true;
            
            // Calculate correct opacity for current scroll position
            const scrollY = window.scrollY;
            let targetOpacity = this.interpolate(this.logoOpacityStart, this.logoOpacityEnd, scrollY, 500);
            targetOpacity = Math.max(targetOpacity, this.logoOpacityEnd);
            
            // Set initial position BEFORE making visible
            this.updateScroll(scrollY);
            
            // If already scrolled down significantly, skip fade-in animation
            if (scrollY > 100) {
                // Skip fade-in, set opacity directly to scroll-based value
                this.element.style.opacity = targetOpacity;
                this.fadeInComplete = true;
            } else {
                // Normal fade-in for top of page
                await new Promise(resolve => requestAnimationFrame(resolve));
                this.element.style.transition = `opacity ${this.fadeInDuration}s ease-in`;
                await new Promise(resolve => setTimeout(resolve, 50));
                this.element.style.opacity = this.logoOpacityStart;
                
                // Mark fade-in complete after transition duration
                setTimeout(() => {
                    this.fadeInComplete = true;
                    this.element.style.transition = ''; // Remove transition for scroll updates
                }, this.fadeInDuration * 1000);
            }
        }
    }
    
    interpolate(start, end, scrollY, threshold) {
        return start + (end - start) * Math.sin(Math.min(1, scrollY / threshold) * (Math.PI / 2));
    }
    
    updateScroll(scrollY) {
        if (!this.element || !this.loaded) return;
        
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let scaleLogo = this.interpolate(this.logoStartScale, this.logoEndScale, scrollY, 500);
        scaleLogo = Math.min(scaleLogo, this.logoEndScale);
        
        // Only update opacity after fade-in animation is complete
        if (this.fadeInComplete) {
            let opacity = this.interpolate(this.logoOpacityStart, this.logoOpacityEnd, scrollY, 500);
            opacity = Math.max(opacity, this.logoOpacityEnd);
            this.element.style.opacity = opacity;
        }
        
        const logoTranslateY = this.logoStartY * viewportHeight - scrollY * this.logoScrollFactor;
        const logoTranslateX = this.logoStartX * viewportWidth;
        this.element.style.transform = `translateY(${logoTranslateY}px) translateX(${logoTranslateX}px) scale(${scaleLogo})`;
    }
}

/**
 * GrainEffect - Manages film grain overlay effect
 */
class GrainEffect {
    constructor(fadeInDuration = 0.4) {
        this.fadeInDuration = fadeInDuration; // Fade-in duration in seconds
        this.enabled = true;
        this.videoSpeed = 0.24;
    }
    
    async init() {
        if (!this.enabled) return;
        
        return new Promise((resolve) => {
            const v = document.createElement('video');
            v.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);min-width:100%;min-height:100%;width:auto;height:auto;object-fit:cover;pointer-events:none;z-index:-1;opacity:0;mix-blend-mode:screen;transition:opacity ${this.fadeInDuration}s ease-in`;
            v.muted = v.loop = v.playsInline = true;
            
            v.oncanplaythrough = async () => {
                v.playbackRate = this.videoSpeed;
                v.play().catch(() => {});
                // Fade in grain with proper timing
                await new Promise(resolve => requestAnimationFrame(resolve));
                v.style.opacity = '0.2';
                resolve();
            };
            
            v.onerror = () => {
                v.remove();
                resolve();
            };
            
            v.src = 'assets/videos/film-grain.mp4';
            document.body.appendChild(v);
            
            // Timeout fallback
            setTimeout(resolve, 2000);
        });
    }
}

/**
 * BackgroundHandler - Main coordinator for all background effects
 */
class BackgroundHandler {
    constructor() {
        // Configure fade-in durations (in seconds) for each subsystem
        const cloudsFadeIn = 2;
        const sunFadeIn = 1;
        const logoFadeIn = 2;
        const grainFadeIn = 0.4;
        
        this.cloudSystem = new CloudSystem(cloudsFadeIn);
        this.sunParallax = new SunParallax(sunFadeIn);
        this.logoHandler = new LogoHandler(logoFadeIn);
        this.backgroundColor = new BackgroundColor();
        this.grainEffect = new GrainEffect(grainFadeIn);
        
        this.init();
    }
    
    async init() {
        // Initialize background color FIRST (needed for handleScroll)
        this.backgroundColor.init();
        
        // Start scroll handling immediately (page stays responsive)
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.handleScroll();
        
        // Load assets progressively without blocking page
        this.loadAssets();
    }
    
    async loadAssets() {
        // Load sun and grain in parallel
        await Promise.all([
            this.sunParallax.init(),
            this.grainEffect.init()
        ]);
        
        // Then load logo and clouds with fade-in
        await this.logoHandler.init();
        await this.cloudSystem.init();
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        this.backgroundColor.update(scrollY);
        this.sunParallax.update(scrollY);
        this.logoHandler.updateScroll(scrollY);
    }
}

// Export for use in main.js
window.BackgroundHandler = BackgroundHandler;
