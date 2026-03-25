/**
 * SaveAll - Video Downloader Website
 * Author: afnan
 * Description: JavaScript functionality for SaveAll video downloading service
 */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Get element by selector with error handling
 * @param {string} selector - CSS selector
 * @returns {Element|null} DOM element or null
 */
function getElement(selector) {
    return document.querySelector(selector);
}

/**
 * Get all elements by selector
 * @param {string} selector - CSS selector
 * @returns {NodeList} List of DOM elements
 */
function getElements(selector) {
    return document.querySelectorAll(selector);
}

// ========================================
// DOM ELEMENTS
// ========================================

const platformButtons = getElements('.platform-btn');
const urlInput = getElement('.url-input');
const downloadBtn = getElement('.download-btn');
const faqItems = getElements('.faq-item');
const navLinks = getElements('.nav-link');
const header = getElement('.header');

// ========================================
// PLATFORM SELECTION
// ========================================

/**
 * Handle platform button selection
 */
function handlePlatformSelection() {
    platformButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            platformButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update input placeholder based on platform
            const platform = btn.textContent.toLowerCase();
            updateInputPlaceholder(platform);
            
            // Add subtle animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Update input placeholder based on selected platform
 * @param {string} platform - Platform name
 */
function updateInputPlaceholder(platform) {
    const placeholders = {
        youtube: 'Paste YouTube link here...',
        tiktok: 'Paste TikTok link here...',
        instagram: 'Paste Instagram link here...'
    };
    
    if (urlInput) {
        urlInput.placeholder = placeholders[platform] || 'Paste video link here...';
        
        // Update input border color based on platform
        urlInput.style.borderColor = getPlatformColor(platform);
    }
}

/**
 * Get platform color
 * @param {string} platform - Platform name
 * @returns {string} Color hex code
 */
function getPlatformColor(platform) {
    const colors = {
        youtube: '#ff0000',
        tiktok: '#000000',
        instagram: '#ec4899'
    };
    return colors[platform] || '#8b5cf6';
}

// ========================================
// URL VALIDATION
// ========================================

/**
 * Validate video URL
 * @param {string} url - URL to validate
 * @returns {Object} Validation result with isValid and platform
 */
function validateUrl(url) {
    const patterns = {
        youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        tiktok: /^(https?:\/\/)?(www\.)?(tiktok\.com|vm\.tiktok\.com)\/.+$/,
        instagram: /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/.+$/
    };
    
    for (const [platform, pattern] of Object.entries(patterns)) {
        if (pattern.test(url)) {
            return { isValid: true, platform };
        }
    }
    
    return { isValid: false, platform: null };
}

/**
 * Check if URL is valid
 */
function checkUrlValidity() {
    if (!urlInput) return;
    
    const url = urlInput.value.trim();
    
    if (url.length > 0) {
        const validation = validateUrl(url);
        
        if (validation.isValid) {
            urlInput.style.borderColor = '#10b981'; // Green
            downloadBtn.disabled = false;
            downloadBtn.style.opacity = '1';
            downloadBtn.style.cursor = 'pointer';
        } else {
            urlInput.style.borderColor = '#ef4444'; // Red
            downloadBtn.disabled = true;
            downloadBtn.style.opacity = '0.5';
            downloadBtn.style.cursor = 'not-allowed';
        }
    } else {
        urlInput.style.borderColor = 'rgba(255, 0, 0, 0.1)';
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = '1';
        downloadBtn.style.cursor = 'pointer';
    }
}

/**
 * Handle URL input changes
 */
function handleUrlInput() {
    if (!urlInput) return;
    
    urlInput.addEventListener('input', debounce(checkUrlValidity, 300));
    urlInput.addEventListener('paste', () => {
        setTimeout(checkUrlValidity, 100);
    });
}

// ========================================
// DOWNLOAD FUNCTIONALITY
// ========================================

/**
 * Handle download button click
 */
function handleDownload() {
    if (!urlInput || !downloadBtn) return;
    
    downloadBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        
        if (!url) {
            showNotification('Please enter a video URL', 'error');
            urlInput.focus();
            return;
        }
        
        const validation = validateUrl(url);
        
        if (!validation.isValid) {
            showNotification('Please enter a valid YouTube, TikTok, or Instagram URL', 'error');
            urlInput.focus();
            return;
        }
        
        // Simulate download process
        simulateDownload(validation.platform);
    });
}

/**
 * Simulate download process
 * @param {string} platform - Video platform
 */
function simulateDownload(platform) {
    // Disable button during download
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="31.4 31.4"/>
        </svg>
        Processing...
    `;
    
    // Simulate API call delay
    setTimeout(() => {
        showNotification(`Successfully downloaded from ${platform}!`, 'success');
        
        // Reset button
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Download
        `;
        
        // Clear input
        urlInput.value = '';
        urlInput.style.borderColor = 'rgba(255, 0, 0, 0.1)';
    }, 2000);
}

// ========================================
// FAQ ACCORDION
// ========================================

/**
 * Handle FAQ accordion functionality
 */
function handleFaqAccordion() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
                
                // Smooth scroll to item
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }
    });
}

// ========================================
// NOTIFICATIONS
// ========================================

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = getElement('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add styles dynamically
    addNotificationStyles();
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Icon emoji or SVG
 */
function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

/**
 * Add notification styles dynamically
 */
function addNotificationStyles() {
    if (getElement('#notification-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px 20px;
            max-width: 400px;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #10b981;
        }
        
        .notification-error {
            border-left: 4px solid #ef4444;
        }
        
        .notification-warning {
            border-left: 4px solid #f59e0b;
        }
        
        .notification-info {
            border-left: 4px solid #3b82f6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .notification-success .notification-icon {
            color: #10b981;
        }
        
        .notification-error .notification-icon {
            color: #ef4444;
        }
        
        .notification-warning .notification-icon {
            color: #f59e0b;
        }
        
        .notification-info .notification-icon {
            color: #3b82f6;
        }
        
        .notification-message {
            flex: 1;
            color: #ffffff;
            font-size: 0.9375rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .spinner {
            animation: spin 1s linear infinite;
        }
    `;
    
    document.head.appendChild(style);
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

/**
 * Handle header scroll effect
 */
function handleHeaderScroll() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.style.background = 'rgba(10, 10, 26, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 26, 0.9)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// SMOOTH SCROLL
// ========================================

/**
 * Handle smooth scroll for navigation links
 */
function handleSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = getElement(href);
                
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

/**
 * Handle scroll animations
 */
function handleScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = getElements('.section, .step-card, .platform-card, .feature-card, .stat-card');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================

/**
 * Handle keyboard navigation
 */
function handleKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Press Enter to submit when input is focused
        if (e.key === 'Enter' && document.activeElement === urlInput) {
            downloadBtn.click();
        }
        
        // Press Escape to close notifications
        if (e.key === 'Escape') {
            const notification = getElement('.notification');
            if (notification) {
                notification.remove();
            }
        }
    });
}

// ========================================
// CTA BUTTON ANIMATION
// ========================================

/**
 * Handle CTA button animation
 */
function handleCtaButton() {
    const ctaButton = getElement('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Focus on input field
            setTimeout(() => {
                if (urlInput) {
                    urlInput.focus();
                }
            }, 800);
        });
    }
}

// ========================================
// COPY TO CLIPBOARD FUNCTIONALITY
// ========================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        showNotification('Failed to copy to clipboard', 'error');
        return false;
    }
}

// ========================================
// LOCAL STORAGE
// ========================================

/**
 * Save user preferences to local storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        console.error('Failed to save to localStorage:', err);
    }
}

/**
 * Get user preferences from local storage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
        console.error('Failed to read from localStorage:', err);
        return defaultValue;
    }
}

// ========================================
// ANALYTICS TRACKING
// ========================================

/**
 * Track user actions (placeholder for analytics)
 * @param {string} action - Action name
 * @param {Object} data - Additional data
 */
function trackAction(action, data = {}) {
    // Placeholder for analytics integration
    console.log('Tracking:', action, data);
    
    // Example: Send to analytics service
    // analytics.track(action, data);
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    console.log('SaveAll initialized - Author: afnan');
    
    // Initialize all handlers
    handlePlatformSelection();
    handleUrlInput();
    handleDownload();
    handleFaqAccordion();
    handleHeaderScroll();
    handleSmoothScroll();
    handleScrollAnimations();
    handleKeyboardNavigation();
    handleCtaButton();
    
    // Load saved preferences
    const savedPlatform = getFromLocalStorage('selectedPlatform', 'youtube');
    const correspondingBtn = getElement(`.platform-btn.${savedPlatform}`);
    if (correspondingBtn) {
        correspondingBtn.click();
    }
    
    // Track page view
    trackAction('page_view', {
        page: 'home',
        timestamp: new Date().toISOString()
    });
    
    // Add loading complete class
    document.body.classList.add('loaded');
}

/**
 * Handle page visibility changes
 */
function handleVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            trackAction('page_hidden');
        } else {
            trackAction('page_visible');
        }
    });
}

/**
 * Handle before unload
 */
function handleBeforeUnload() {
    window.addEventListener('beforeunload', () => {
        // Save current state
        const activePlatform = getElement('.platform-btn.active');
        if (activePlatform) {
            saveToLocalStorage('selectedPlatform', activePlatform.classList[1]);
        }
    });
}

// ========================================
// EVENT LISTENERS
// ========================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle visibility changes
handleVisibilityChange();

// Handle before unload
handleBeforeUnload();

// ========================================
// EXPORT FUNCTIONS (for module usage)
// ========================================

// If using modules, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateUrl,
        showNotification,
        copyToClipboard,
        saveToLocalStorage,
        getFromLocalStorage,
        trackAction
    };
}
