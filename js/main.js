// Main application initialization and global functionality
class App {
    constructor() {
        this.init();
    }

    init() {
        this.bindGlobalEvents();
        this.initializeApp();
        this.setupPerformanceOptimizations();
    }

    bindGlobalEvents() {
        // Page load event
        window.addEventListener('load', () => {
            this.onPageLoad();
        });

        // Resize event
        window.addEventListener('resize', this.debounce(() => {
            this.onWindowResize();
        }, 250));

        // Scroll event
        window.addEventListener('scroll', this.debounce(() => {
            this.onScroll();
        }, 100));

        // Online/Offline events
        window.addEventListener('online', () => {
            showToast('Connection restored', 'success');
        });

        window.addEventListener('offline', () => {
            showToast('Connection lost', 'warning');
        });

        // Prevent form submission on Enter key for search inputs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type === 'search') {
                e.preventDefault();
            }
        });

        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            showToast('Something went wrong. Please try again.', 'error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            showToast('Something went wrong. Please try again.', 'error');
        });
    }

    initializeApp() {
        // Initialize data if first visit
        this.initializeData();
        
        // Set up initial page state
        this.setupInitialState();
        
        // Initialize lazy loading
        this.initializeLazyLoading();
        
        // Setup accessibility features
        this.setupAccessibility();
        
        // Initialize analytics (placeholder)
        this.initializeAnalytics();
    }

    initializeData() {
        // Check if this is the first visit
        const isFirstVisit = !localStorage.getItem('popout_initialized');
        
        if (isFirstVisit) {
            // Set up sample data
            localStorage.setItem('popout_events', JSON.stringify(sampleEvents));
            localStorage.setItem('popout_users', JSON.stringify([]));
            localStorage.setItem('popout_tickets', JSON.stringify([]));
            localStorage.setItem('popout_initialized', 'true');
            
            // Show welcome message
            setTimeout(() => {
                showToast('Welcome to Lite Events Tickets!', 'success');
            }, 1000);
        }
    }

    setupInitialState() {
        // Show home page by default
        uiManager.showPage('home');
        
        // Update auth UI
        authManager.updateUI();
        
        // Load initial content
        eventManager.loadFeaturedEvents();
    }

    initializeLazyLoading() {
        // Set up intersection observer for lazy loading
        if ('IntersectionObserver' in window) {
            uiManager.lazyLoadImages();
        }
    }

    setupAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // ESC key closes modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
            
            // Tab navigation improvements
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add ARIA labels and roles where needed
        this.enhanceAccessibility();
    }

    enhanceAccessibility() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Add role attributes to navigation
        const nav = document.querySelector('.navbar');
        if (nav) nav.setAttribute('role', 'navigation');

        // Add landmark roles
        const main = document.querySelector('main');
        if (main) main.setAttribute('role', 'main');
    }

    initializeAnalytics() {
        // Placeholder for analytics initialization
        // In a real app, you would initialize Google Analytics, Mixpanel, etc.
        console.log('Analytics initialized');
    }

    onPageLoad() {
        // Remove loading states
        document.body.classList.remove('loading');
        
        // Initialize tooltips or other UI enhancements
        this.initializeTooltips();
        
        // Check for saved user session
        this.checkUserSession();
    }

    onWindowResize() {
        // Handle responsive adjustments
        const viewport = uiManager.getViewport();
        
        // Close mobile menu on desktop
        if (viewport.width > 768) {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    onScroll() {
        // Add scroll-based effects
        const scrollY = window.scrollY;
        const navbar = document.querySelector('.navbar');
        
        // Add shadow to navbar on scroll
        if (scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    initializeTooltips() {
        // Simple tooltip implementation
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.id = 'global-tooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }

    hideTooltip() {
        const tooltip = document.getElementById('global-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    checkUserSession() {
        // Check if user session is still valid
        const currentUser = JSON.parse(localStorage.getItem('popout_current_user'));
        if (currentUser) {
            authManager.currentUser = currentUser;
            authManager.updateUI();
        }
    }

    // Utility functions
    debounce(func, wait) {
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

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }, 0);
            });
        }
    }

    setupPerformanceOptimizations() {
        // Measure performance
        this.measurePerformance();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Set up service worker (if needed)
        this.setupServiceWorker();
    }

    preloadCriticalResources() {
        // Preload critical images
        const criticalImages = [
            'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        // Service worker setup for offline functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // In a real app, you would register a service worker here
                console.log('Service worker support detected');
            });
        }
    }

    // Public API methods
    refreshData() {
        eventManager.loadFeaturedEvents();
        eventManager.loadAllEvents();
        if (authManager.isLoggedIn()) {
            ticketManager.loadUserTickets();
        }
    }

    exportUserData() {
        if (!authManager.isLoggedIn()) {
            showToast('Please login to export data', 'warning');
            return;
        }

        const userData = {
            user: authManager.currentUser,
            tickets: getUserTickets(authManager.currentUser.id),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `popout-tickets-data-${Date.now()}.json`;
        link.click();
        
        showToast('Data exported successfully', 'success');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    }
}

// Initialize the application
const app = new App();

// Make app instance globally available for debugging
window.PopOutApp = app;

// Add some global utility functions
window.showToast = showToast;
window.showPage = showPage;

// Console welcome message
console.log('%cLite Events Tickets', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to Lite Events Tickets! Event management made simple.', 'color: #64748b; font-size: 14px;');
console.log('%cFor debugging, use: LiteEventsApp', 'color: #64748b; font-size: 12px;');