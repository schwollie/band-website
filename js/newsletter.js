/**
 * Newsletter Handler
 * Manages newsletter subscription functionality with Supabase
 */

class NewsletterHandler {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.isSubmitting = false; // Prevent double submissions
    }

    init() {
        this.setupForm();
    }

    /**
     * Email validation helper
     */
    isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email) && email.length <= 254; // RFC 5321 limit
    }

    /**
     * Email sanitization helper
     */
    sanitizeEmail(email) {
        return email.trim().toLowerCase();
    }

    setupForm() {
        const newsletterForm = document.getElementById('newsletter-form');
        const formMessage = document.getElementById('form-message');

        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Prevent multiple simultaneous submissions
            if (this.isSubmitting) return;
            this.isSubmitting = true;

            const emailInput = document.getElementById('email');
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Update UI to show loading state
            submitButton.textContent = 'SUBSCRIBING...';
            submitButton.disabled = true;
            formMessage.textContent = '';

            try {
                const rawEmail = emailInput.value;

                // Client-side validation
                if (!rawEmail) {
                    throw new Error('Please enter an email address.');
                }

                const email = this.sanitizeEmail(rawEmail);

                if (!this.isValidEmail(email)) {
                    throw new Error('Please enter a valid email address.');
                }

                // Attempt to insert email into Supabase
                const { data, error } = await this.supabase
                    .from('emails')
                    .insert([{ email: email }]);

                if (error) {
                    // Handle specific error cases
                    if (error.code === '23505') { // PostgreSQL unique constraint violation
                        throw new Error('You\'re already subscribed to our newsletter!');
                    } else if (error.message.includes('duplicate key')) {
                        throw new Error('You\'re already subscribed to our newsletter!');
                    } else {
                        console.error('Supabase error:', error);
                        throw new Error('Something went wrong. Please try again later.');
                    }
                }

                // Success
                formMessage.textContent = 'Thank you! Welcome to the LYMINA family! 🎵';
                formMessage.style.color = 'var(--sunset-purple)';
                emailInput.value = '';

            } catch (error) {
                // Display error message
                formMessage.textContent = error.message;
                formMessage.style.color = 'var(--error-red)'; // Red color for errors
            } finally {
                // Reset UI state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                this.isSubmitting = false;

                // Clear message after 6 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.style.color = 'var(--sunset-purple)'; // Reset to original color
                }, 6000);
            }
        });
    }
}

// Export for use in main.js
window.NewsletterHandler = NewsletterHandler;
