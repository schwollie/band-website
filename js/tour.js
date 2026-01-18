/**
 * Tour Dates Handler
 * Manages the tour dates section with tabs for upcoming and past shows
 */

class TourHandler {
    constructor() {
        // All tour dates - will be automatically sorted into upcoming/past
        this.tourDates = [
            { date: "MAY 23, 2025", venue: "Poschinger Villa", location: "Landshut, DE", soldOut: false, otherArtists: ["Dark you"] },
            { date: "JAN 17, 2024", venue: "Kinokafe", location: "Taufkirchen (Vils)", soldOut: false, otherArtists: ["The Drunken Dentists"]},
            { date: "JUL 26, 2024", venue: "Hoffest", location: "Kaidach",soldOut: false, otherArtists: ["Cloudsurfers"]},
            { date: "JUN 20, 2024", venue: "Kunstkloss", location: "Giesinger Bahnhof",soldOut: false, otherArtists: ["Heaxxa", "Precious & Fraktionsloser"]},
            { date: "FEB 2, 2024", venue: "Waschbar", location: "Regensburg",soldOut: false, otherArtists: ["G2theA"]},
        ];
        
        this.activeTab = 'upcoming';
    }

    // Parse date string "JUL 25, 2025" to Date object
    parseDate(dateStr) {
        const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
        const parts = dateStr.match(/(\w+)\s+(\d+),\s+(\d+)/);
        if (!parts) return new Date(0);
        return new Date(parseInt(parts[3]), months[parts[1]], parseInt(parts[2]));
    }

    init() {
        this.renderTabs();
        this.renderTourDates();
        this.bindTabEvents();
    }

    renderTabs() {
        const container = document.querySelector('#tour .container');
        if (!container) return;
        
        const h2 = container.querySelector('h2');
        if (!h2) return;
        
        // Insert tabs after h2
        const tabsHtml = `
            <div class="tour-tabs">
                <button class="tour-tab active" data-tab="upcoming">Neue Shows</button>
                <button class="tour-tab" data-tab="past">Vergangene Events</button>
            </div>
        `;
        h2.insertAdjacentHTML('afterend', tabsHtml);
    }

    bindTabEvents() {
        const tabs = document.querySelectorAll('.tour-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeTab = tab.dataset.tab;
                this.renderTourDates();
            });
        });
    }

    renderTourDates() {
        const showList = document.querySelector('.show-list');
        if (!showList) return;
        
        const now = new Date();
        
        // Sort all dates and split into upcoming/past
        const sorted = [...this.tourDates].sort((a, b) => this.parseDate(a.date) - this.parseDate(b.date));
        const upcoming = sorted.filter(show => this.parseDate(show.date) >= now);
        const past = sorted.filter(show => this.parseDate(show.date) < now).reverse(); // Most recent first
        
        const shows = this.activeTab === 'upcoming' ? upcoming : past;
        
        if (shows.length === 0) {
            if (this.activeTab === 'upcoming') {
                showList.innerHTML = `
                    <li class="no-shows-message">
                        <div class="no-shows-content">
                            <h3>Bald kommen Updates für Festivals 2026!</h3>
                            <p>Wir arbeiten an neuen Terminen und werden euch bald über kommende Auftritte informieren. Bleibt dran!</p>
                        </div>
                    </li>
                `;
            } else {
                showList.innerHTML = `
                    <li class="no-shows-message">
                        <div class="no-shows-content">
                            <p>Noch keine vergangenen Shows.</p>
                        </div>
                    </li>
                `;
            }
        } else {
            showList.innerHTML = shows.map(show => `
                <li>
                    <span class="date">${show.date}</span>
                    <span class="venue">${show.venue}${show.otherArtists?.length ? `<span class="other-artists">mit ${show.otherArtists.join(', ')}</span>` : ''}</span>
                    <span class="location">${show.location}</span>
                    ${this.activeTab === 'upcoming' ? `
                        <a href="#" class="ticket-btn ${show.soldOut ? 'sold-out' : ''}">
                            ${show.soldOut ? 'Sold Out' : 'Get Tickets'}
                        </a>
                    ` : '<span class="past-label">Vergangen</span>'}
                </li>
            `).join('');
        }
    }

    addTourDate(tourDate) {
        this.tourDates.push(tourDate);
        this.renderTourDates();
    }
}

window.TourHandler = TourHandler;
