/**
 * Security Utilities for ATS Services
 * Provides functions for input validation, sanitization, and XSS protection
 */

const Security = {
    /**
     * Escapes HTML special characters to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHTML: function (text) {
        if (typeof text !== 'string') return text;

        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;',
            '/': '&#x2F;'
        };

        return text.replace(/[&<>"'/]/g, char => map[char]);
    },

    /**
     * Sanitizes HTML content by removing dangerous tags and attributes
     * @param {string} html - HTML to sanitize
     * @returns {string} Sanitized HTML
     */
    sanitizeHTML: function (html) {
        if (typeof html !== 'string') return '';

        // Create a temporary div to parse HTML
        const temp = document.createElement('div');
        temp.textContent = html; // This escapes all HTML

        // For cases where we need to preserve some HTML, use a whitelist approach
        const allowedTags = ['b', 'i', 'em', 'strong', 'span', 'br', 'p'];
        const allowedAttributes = ['class'];

        // For now, we'll use the strict escaping approach
        return temp.innerHTML;
    },

    /**
     * Safely sets HTML content with sanitization
     * @param {HTMLElement} element - Element to set content
     * @param {string} content - Content to set
     */
    setHTMLContent: function (element, content) {
        if (!element) return;

        // If content contains no HTML tags, use textContent for safety
        if (!/[<>]/.test(content)) {
            element.textContent = content;
        } else {
            element.innerHTML = this.sanitizeHTML(content);
        }
    },

    /**
     * Validates email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    validateEmail: function (email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return regex.test(email);
    },

    /**
     * Validates phone number format (international)
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid
     */
    validatePhone: function (phone) {
        // Remove spaces, dashes, parentheses
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        // Check if it's a valid international number (+ followed by 7-15 digits)
        const regex = /^\+?[0-9]{7,15}$/;
        return regex.test(cleaned);
    },

    /**
     * Validates name (letters, spaces, hyphens, apostrophes only)
     * @param {string} name - Name to validate
     * @returns {boolean} True if valid
     */
    validateName: function (name) {
        const regex = /^[a-zA-ZÀ-ÿ\s'\-]+$/;
        return regex.test(name) && name.trim().length > 0;
    },

    /**
     * Validates license plate format (Belgian format)
     * @param {string} plate - License plate to validate
     * @returns {boolean} True if valid
     */
    validateLicensePlate: function (plate) {
        // Belgian format: 1-ABC-123 or similar variations
        const regex = /^[0-9A-Z]{1,3}[-\s]?[A-Z]{3}[-\s]?[0-9]{3}$/i;
        return regex.test(plate.trim());
    },

    /**
     * Validates VAT number format
     * @param {string} vat - VAT number to validate
     * @returns {boolean} True if valid format
     */
    validateVATFormat: function (vat) {
        // Basic format check for EU VAT numbers
        const cleaned = vat.replace(/[\s\.\-]/g, '');
        const regex = /^[A-Z]{2}[0-9A-Z]{2,12}$/;
        return regex.test(cleaned);
    },

    /**
     * Sanitizes numeric input (removes non-numeric characters)
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized numeric string
     */
    sanitizeNumeric: function (input) {
        return input.replace(/[^0-9.\-]/g, '');
    },

    /**
     * Validates year (between 1900 and current year + 1)
     * @param {number} year - Year to validate
     * @returns {boolean} True if valid
     */
    validateYear: function (year) {
        const currentYear = new Date().getFullYear();
        const numYear = parseInt(year, 10);
        return numYear >= 1900 && numYear <= currentYear + 1;
    },

    /**
     * Validates date is not in the past
     * @param {string} dateStr - Date string (YYYY-MM-DD)
     * @param {string} timeStr - Time string (HH:MM)
     * @returns {boolean} True if date is in the future
     */
    validateFutureDate: function (dateStr, timeStr) {
        if (!dateStr) return false;

        const dateTime = new Date(`${dateStr}${timeStr ? 'T' + timeStr : ''}`);
        const now = new Date();

        return dateTime >= now;
    },

    /**
     * Generates a CSRF token
     * @returns {string} CSRF token
     */
    generateCSRFToken: function () {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    },

    /**
     * Stores CSRF token in session storage
     */
    setCSRFToken: function () {
        const token = this.generateCSRFToken();
        sessionStorage.setItem('csrf_token', token);
        return token;
    },

    /**
     * Gets CSRF token from session storage
     * @returns {string} CSRF token
     */
    getCSRFToken: function () {
        let token = sessionStorage.getItem('csrf_token');
        if (!token) {
            token = this.setCSRFToken();
        }
        return token;
    },

    /**
     * Validates CSRF token
     * @param {string} token - Token to validate
     * @returns {boolean} True if valid
     */
    validateCSRFToken: function (token) {
        return token === this.getCSRFToken();
    },

    /**
     * Rate limiting helper (client-side)
     * @param {string} key - Unique key for the action
     * @param {number} maxAttempts - Maximum attempts allowed
     * @param {number} timeWindow - Time window in milliseconds
     * @returns {boolean} True if action is allowed
     */
    checkRateLimit: function (key, maxAttempts = 5, timeWindow = 60000) {
        const storageKey = `ratelimit_${key}`;
        const now = Date.now();

        let attempts = JSON.parse(localStorage.getItem(storageKey) || '[]');

        // Filter out old attempts outside the time window
        attempts = attempts.filter(timestamp => now - timestamp < timeWindow);

        if (attempts.length >= maxAttempts) {
            return false; // Rate limit exceeded
        }

        // Add current attempt
        attempts.push(now);
        localStorage.setItem(storageKey, JSON.stringify(attempts));

        return true;
    },

    /**
     * Clears rate limit for a key
     * @param {string} key - Key to clear
     */
    clearRateLimit: function (key) {
        localStorage.removeItem(`ratelimit_${key}`);
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Security;
}

// Make available globally
window.Security = Security;
