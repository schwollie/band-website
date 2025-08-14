/**
 * Tour Dates Handler
 * Manages the tour dates section rendering and interactions
 */

class TourHandler {
    constructor() {
        // Tour dates data
        this.tourDates = [
            { date: "JUL 25, 2025", venue: "The Sunnyvale", location: "Austin, TX", soldOut: false },
            { date: "AUG 12, 2025", venue: "The Root Cellar", location: "Kingston, JM", soldOut: false },
            { date: "SEP 05, 2025", venue: "Beachside Tavern", location: "San Diego, CA", soldOut: true },
            { date: "OCT 19, 2025", venue: "The Folk Fest", location: "Asheville, NC", soldOut: false },
        ];
    }

    init() {
        this.renderTourDates();
    }

    renderTourDates() {
        const showList = document.querySelector('.show-list');
        if (!showList) return;
        
        showList.innerHTML = this.tourDates.map(show => `
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

    // Method to add new tour date
    addTourDate(tourDate) {
        this.tourDates.push(tourDate);
        this.renderTourDates();
    }

    // Method to update existing tour date
    updateTourDate(index, tourDate) {
        if (index >= 0 && index < this.tourDates.length) {
            this.tourDates[index] = tourDate;
            this.renderTourDates();
        }
    }
}

// Export for use in main.js
window.TourHandler = TourHandler;
