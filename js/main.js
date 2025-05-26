/**
 * Football Trip Planner - Main JavaScript
 * Common functionality across all pages
 */

$(document).ready(function() {
    console.log('Football Trip Planner - MVP Loaded');
    
    // Initialize common functionality
    initializeCommonFeatures();
    
    // Page-specific initialization
    const currentPage = getCurrentPage();
    if (currentPage) {
        initializePage(currentPage);
    }
});

/**
 * Initialize common features across all pages
 */
function initializeCommonFeatures() {
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 100
            }, 1000);
        }
    });
    
    // Form validation helpers
    setupFormValidation();
    
    // Loading states
    setupLoadingStates();
    
    // Navigation helpers
    setupNavigationHelpers();
    
    // Debug info (remove in production)
    if (localStorage.getItem('debug_mode') === 'true') {
        console.log('Debug mode enabled');
        showDebugInfo();
    }
}

/**
 * Get current page identifier
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
}

/**
 * Initialize page-specific functionality
 */
function initializePage(pageName) {
    console.log(`Initializing page: ${pageName}`);
    
    switch(pageName) {
        case 'index':
            initializeIndexPage();
            break;
        case 'home':
            initializeHomePage();
            break;
        case 'auth':
            initializeAuthPage();
            break;
        case 'select_league':
            initializeLeaguePage();
            break;
        case 'select_team':
            initializeTeamPage();
            break;
        case 'select_dates':
            initializeDatesPage();
            break;
        case 'select_match':
            initializeMatchPage();
            break;
        case 'select_transport':
            initializeTransportPage();
            break;
        case 'select_accommodation':
            initializeAccommodationPage();
            break;
        case 'cost_summary':
            initializeCostSummaryPage();
            break;
        case 'payment':
            initializePaymentPage();
            break;
        case 'confirmation':
            initializeConfirmationPage();
            break;
    }
}

/**
 * Index page initialization
 */
function initializeIndexPage() {
    // Add any index-specific functionality here
    console.log('Index page loaded');
}

/**
 * Home page initialization (airport selection)
 */
function initializeHomePage() {
    // Airport autocomplete is handled in the template
    // Add any additional home page functionality here
    console.log('Home page loaded');
}

/**
 * Auth page initialization
 */
function initializeAuthPage() {
    // Add authentication animations or additional validation
    console.log('Auth page loaded');
}

/**
 * League selection page
 */
function initializeLeaguePage() {
    // Add league selection animations
    $('.league-card').hover(
        function() {
            $(this).addClass('hover-effect');
        },
        function() {
            $(this).removeClass('hover-effect');
        }
    );
}

/**
 * Team selection page
 */
function initializeTeamPage() {
    // Add team selection animations
    $('.team-card').hover(
        function() {
            $(this).addClass('hover-effect');
        },
        function() {
            $(this).removeClass('hover-effect');
        }
    );
}

/**
 * Dates selection page
 */
function initializeDatesPage() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    $('input[type="date"]').attr('min', today);
}

/**
 * Match selection page
 */
function initializeMatchPage() {
    // Add match selection functionality
    console.log('Match page loaded');
}

/**
 * Transport selection page
 */
function initializeTransportPage() {
    // Add transport selection functionality
    console.log('Transport page loaded');
}

/**
 * Accommodation selection page
 */
function initializeAccommodationPage() {
    // Add accommodation selection functionality
    console.log('Accommodation page loaded');
}

/**
 * Cost summary page
 */
function initializeCostSummaryPage() {
    // Add cost calculation animations
    animateCostCounters();
}

/**
 * Payment page
 */
function initializePaymentPage() {
    // Payment form enhancements
    setupPaymentFormValidation();
}

/**
 * Confirmation page
 */
function initializeConfirmationPage() {
    // Add success animations
    setTimeout(() => {
        $('.success-icon').addClass('animate-bounce');
    }, 500);
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    // Real-time validation for email fields
    $('input[type="email"]').on('blur', function() {
        const email = $(this).val();
        const isValid = validateEmail(email);
        
        if (email && !isValid) {
            $(this).addClass('error');
            showFieldError($(this), 'Please enter a valid email address');
        } else {
            $(this).removeClass('error');
            hideFieldError($(this));
        }
    });
    
    // Phone number formatting
    $('input[type="tel"]').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.substring(0, 3) + '-' + value.substring(3);
            } else {
                value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
            }
        }
        $(this).val(value);
    });
}

/**
 * Setup loading states
 */
function setupLoadingStates() {
    // Add loading state to buttons on form submission
    $('form').on('submit', function() {
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        
        submitBtn.prop('disabled', true);
        submitBtn.html('<span class="spinner"></span> Loading...');
        
        // Reset after 3 seconds (in case form doesn't redirect)
        setTimeout(() => {
            submitBtn.prop('disabled', false);
            submitBtn.text(originalText);
        }, 3000);
    });
}

/**
 * Setup navigation helpers
 */
function setupNavigationHelpers() {
    // Confirm navigation away from forms with data
    window.addEventListener('beforeunload', function(e) {
        const hasFormData = $('input, select, textarea').filter(function() {
            return $(this).val() !== '' && $(this).val() !== $(this).attr('placeholder');
        }).length > 0;
        
        const isPaymentPage = window.location.pathname.includes('payment');
        
        if (hasFormData && !isPaymentPage) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

/**
 * Animate cost counters
 */
function animateCostCounters() {
    $('.cost-amount').each(function() {
        const $this = $(this);
        const text = $this.text();
        const match = text.match(/€(\d+)/);
        
        if (match) {
            const finalValue = parseInt(match[1]);
            $this.text('€0');
            
            $({ counter: 0 }).animate({ counter: finalValue }, {
                duration: 1500,
                easing: 'swing',
                step: function() {
                    $this.text('€' + Math.ceil(this.counter));
                }
            });
        }
    });
}

/**
 * Setup payment form validation
 */
function setupPaymentFormValidation() {
    // Credit card number validation
    $('#cardNumber').on('input', function() {
        let value = $(this).val().replace(/\s/g, '');
        const isValid = validateCreditCard(value.replace(/\s/g, ''));
        
        if (value.length > 0) {
            $(this).toggleClass('error', !isValid && value.length >= 13);
        }
    });
    
    // CVV validation
    $('#cvv').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        $(this).val(value.substring(0, 3));
    });
    
    // Expiry date validation
    $('#expiryDate').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        if (value.length >= 4) {
            const month = parseInt(value.substring(0, 2));
            const year = parseInt(value.substring(2, 4));
            
            const isExpired = year < currentYear || (year === currentYear && month < currentMonth);
            const isValidMonth = month >= 1 && month <= 12;
            
            $(this).toggleClass('error', isExpired || !isValidMonth);
        }
    });
}

/**
 * Utility Functions
 */

/**
 * Validate email address
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Basic credit card validation (Luhn algorithm)
 */
function validateCreditCard(number) {
    if (!/^\d+$/.test(number) || number.length < 13 || number.length > 19) {
        return false;
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

/**
 * Show field error
 */
function showFieldError($field, message) {
    const $error = $field.siblings('.field-error');
    if ($error.length === 0) {
        $field.after(`<div class="field-error">${message}</div>`);
    } else {
        $error.text(message);
    }
}

/**
 * Hide field error
 */
function hideFieldError($field) {
    $field.siblings('.field-error').remove();
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Format date
 */
function formatDate(dateString, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    return new Date(dateString).toLocaleDateString('en-GB', formatOptions);
}

/**
 * Local storage helpers
 */
const Storage = {
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error parsing localStorage item:', key, e);
            return defaultValue;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error setting localStorage item:', key, e);
            return false;
        }
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    },
    
    clear: function() {
        localStorage.clear();
    }
};

/**
 * Debug helpers (remove in production)
 */
function showDebugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('Current selections:', {
        origin: Storage.get('selectedOrigin'),
        league: Storage.get('selectedLeague'),
        team: Storage.get('selectedTeam'),
        dates: Storage.get('selectedDates'),
        match: Storage.get('selectedMatch'),
        flight: Storage.get('selectedFlight'),
        hotel: Storage.get('selectedHotel'),
        total: Storage.get('tripTotal')
    });
    console.log('==================');
}

/**
 * Enable debug mode (call from console)
 */
function enableDebugMode() {
    localStorage.setItem('debug_mode', 'true');
    console.log('Debug mode enabled. Refresh the page to see debug info.');
}

/**
 * Disable debug mode
 */
function disableDebugMode() {
    localStorage.removeItem('debug_mode');
    console.log('Debug mode disabled.');
}

/**
 * Mock API simulation helpers
 */
const MockAPI = {
    // Simulate API delay
    delay: function(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Simulate flight search
    searchFlights: async function(origin, destination, date) {
        await this.delay(1500);
        
        // Mock flight data based on origin/destination
        const basePrice = this.calculateFlightPrice(origin, destination);
        
        return [
            {
                id: 1,
                airline: 'Ryanair',
                price: Math.round(basePrice * 0.7),
                departure: '08:30',
                arrival: '12:45',
                duration: '2h 15m'
            },
            {
                id: 2,
                airline: 'British Airways',
                price: Math.round(basePrice * 1.2),
                departure: '14:20',
                arrival: '18:10',
                duration: '2h 50m'
            },
            {
                id: 3,
                airline: 'Lufthansa',
                price: Math.round(basePrice * 0.9),
                departure: '19:45',
                arrival: '23:30',
                duration: '3h 45m'
            }
        ];
    },
    
    // Simulate hotel search
    searchHotels: async function(city, checkIn, nights) {
        await this.delay(1200);
        
        const basePrice = this.calculateHotelPrice(city);
        
        return [
            {
                id: 1,
                name: `${city} Stadium Hotel`,
                rating: 4,
                pricePerNight: Math.round(basePrice * 1.5),
                distance: '0.3 km from stadium'
            },
            {
                id: 2,
                name: `City Center ${city}`,
                rating: 4,
                pricePerNight: Math.round(basePrice * 1.2),
                distance: '2.1 km from stadium'
            },
            {
                id: 3,
                name: `Budget Inn ${city}`,
                rating: 3,
                pricePerNight: Math.round(basePrice * 0.7),
                distance: '1.8 km from stadium'
            }
        ];
    },
    
    // Calculate flight price based on route
    calculateFlightPrice: function(origin, destination) {
        const routes = {
            'LHR-MAD': 180, 'LHR-BCN': 200, 'LHR-FCO': 220,
            'CDG-LHR': 150, 'CDG-MAD': 180, 'CDG-BCN': 170,
            'MAD-LHR': 180, 'MAD-CDG': 180, 'MAD-FCO': 190
        };
        
        const route = `${origin}-${destination}`;
        return routes[route] || 200;
    },
    
    // Calculate hotel price based on city
    calculateHotelPrice: function(city) {
        const cityPrices = {
            'London': 120, 'Madrid': 90, 'Barcelona': 100,
            'Rome': 85, 'Milan': 95, 'Paris': 110,
            'Munich': 80, 'Manchester': 70
        };
        
        return cityPrices[city] || 80;
    }
};

/**
 * Booking flow helpers
 */
const BookingFlow = {
    // Get current step
    getCurrentStep: function() {
        const steps = [
            'index', 'auth', 'home', 'select_league', 'select_team',
            'select_dates', 'select_match', 'select_transport',
            'select_accommodation', 'cost_summary', 'payment', 'confirmation'
        ];
        
        const currentPage = getCurrentPage();
        return steps.indexOf(currentPage);
    },
    
    // Get progress percentage
    getProgressPercentage: function() {
        const currentStep = this.getCurrentStep();
        const totalSteps = 11; // Excluding index
        return Math.round((currentStep / totalSteps) * 100);
    },
    
    // Validate current step data
    validateStep: function(step) {
        switch(step) {
            case 'home':
                return Storage.get('selectedOrigin') !== null;
            case 'select_league':
                return Storage.get('selectedLeague') !== null;
            case 'select_team':
                return Storage.get('selectedTeam') !== null;
            case 'select_dates':
                return Storage.get('selectedDates') !== null;
            case 'select_match':
                return Storage.get('selectedMatch') !== null;
            case 'select_transport':
                return Storage.get('selectedFlight') !== null;
            case 'select_accommodation':
                return Storage.get('selectedHotel') !== null;
            default:
                return true;
        }
    },
    
    // Get booking summary
    getSummary: function() {
        return {
            origin: Storage.get('selectedOrigin'),
            league: Storage.get('selectedLeague'),
            team: Storage.get('selectedTeam'),
            dates: Storage.get('selectedDates'),
            match: Storage.get('selectedMatch'),
            flight: Storage.get('selectedFlight'),
            hotel: Storage.get('selectedHotel'),
            total: Storage.get('tripTotal')
        };
    },
    
    // Clear all booking data
    clearAll: function() {
        const keys = [
            'selectedOrigin', 'selectedLeague', 'selectedTeam',
            'selectedDates', 'selectedMatch', 'selectedFlight',
            'selectedHotel', 'tripTotal'
        ];
        
        keys.forEach(key => Storage.remove(key));
    }
};

/**
 * UI Helpers
 */
const UI = {
    // Show loading overlay
    showLoading: function(message = 'Loading...') {
        if ($('#loadingOverlay').length === 0) {
            $('body').append(`
                <div id="loadingOverlay" class="loading-overlay">
                    <div class="loading-content">
                        <div class="loading-spinner"></div>
                        <p>${message}</p>
                    </div>
                </div>
            `);
        }
    },
    
    // Hide loading overlay
    hideLoading: function() {
        $('#loadingOverlay').fadeOut(300, function() {
            $(this).remove();
        });
    },
    
    // Show notification
    showNotification: function(message, type = 'info', duration = 3000) {
        const notification = $(`
            <div class="notification notification-${type}">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        }, duration);
        
        // Manual close
        notification.find('.notification-close').on('click', function() {
            notification.fadeOut(300, function() {
                $(this).remove();
            });
        });
    },
    
    // Show modal
    showModal: function(title, content, buttons = []) {
        const modal = $(`
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${buttons.map(btn => `<button class="btn ${btn.class || 'btn-secondary'}" data-action="${btn.action || ''}">${btn.text}</button>`).join('')}
                    </div>
                </div>
            </div>
        `);
        
        $('body').append(modal);
        
        // Close handlers
        modal.find('.modal-close, .modal-overlay').on('click', function(e) {
            if (e.target === this) {
                modal.fadeOut(300, function() {
                    $(this).remove();
                });
            }
        });
        
        // Button handlers
        modal.find('[data-action]').on('click', function() {
            const action = $(this).data('action');
            if (action && typeof window[action] === 'function') {
                window[action]();
            }
            modal.fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        return modal;
    }
};

/**
 * Analytics helpers (for demo purposes)
 */
const Analytics = {
    // Track page view
    trackPageView: function(page) {
        console.log(`[Analytics] Page view: ${page}`);
        // In real app, send to analytics service
    },
    
    // Track event
    trackEvent: function(category, action, label, value) {
        console.log(`[Analytics] Event: ${category} - ${action} - ${label} - ${value}`);
        // In real app, send to analytics service
    },
    
    // Track booking step
    trackBookingStep: function(step, data) {
        console.log(`[Analytics] Booking step: ${step}`, data);
        // In real app, send to analytics service
    },
    
    // Track conversion
    trackConversion: function(totalValue) {
        console.log(`[Analytics] Conversion: €${totalValue}`);
        // In real app, send to analytics service
    }
};

/**
 * Error handling
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Show user-friendly error message
    UI.showNotification('Something went wrong. Please refresh the page and try again.', 'error', 5000);
    
    // In real app, send error to logging service
});

/**
 * Performance monitoring
 */
window.addEventListener('load', function() {
    // Track page load time
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    
    // Track to analytics
    Analytics.trackEvent('Performance', 'PageLoad', getCurrentPage(), Math.round(loadTime));
});

/**
 * Accessibility helpers
 */
const A11y = {
    // Focus management
    trapFocus: function(element) {
        const focusableElements = element.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements.first();
        const lastFocusableElement = focusableElements.last();
        
        element.on('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement[0]) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement[0]) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                element.find('.modal-close, .notification-close').first().click();
            }
        });
    },
    
    // Announce to screen readers
    announce: function(message) {
        const announcement = $(`<div class="sr-only" aria-live="polite" aria-atomic="true">${message}</div>`);
        $('body').append(announcement);
        
        setTimeout(() => {
            announcement.remove();
        }, 1000);
    }
};

/**
 * Export functions for global access
 */
window.FootballTripPlanner = {
    Storage,
    MockAPI,
    BookingFlow,
    UI,
    Analytics,
    A11y,
    enableDebugMode,
    disableDebugMode
};

// Initialize analytics
Analytics.trackPageView(getCurrentPage());