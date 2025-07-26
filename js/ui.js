// UI functionality and utilities
class UIManager {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeModals();
        this.initializeNavigation();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.showPage(page);
            });
        });

        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Hero search button
        document.querySelector('.hero-search button').addEventListener('click', () => {
            const query = document.getElementById('hero-search').value;
            if (query.trim()) {
                eventManager.handleSearch(query);
            }
        });

        // Enter key for hero search
        document.getElementById('hero-search').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value;
                if (query.trim()) {
                    eventManager.handleSearch(query);
                }
            }
        });
    }

    initializeModals() {
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        // Close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                closeBtn.closest('.modal').classList.remove('active');
            });
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    initializeNavigation() {
        // Set active nav link based on current page
        this.updateActiveNavLink();
    }

    showPage(pageId) {
        // Check if page requires authentication
        if ((pageId === 'create-event' || pageId === 'my-tickets') && !authManager.isLoggedIn()) {
            showToast('Please login to access this page', 'warning');
            authManager.showAuthModal('login');
            return;
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
            this.updateActiveNavLink();

            // Load page-specific content
            this.loadPageContent(pageId);

            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    loadPageContent(pageId) {
        switch (pageId) {
            case 'home':
                eventManager.loadFeaturedEvents();
                break;
            case 'events':
                eventManager.loadAllEvents();
                break;
            case 'my-tickets':
                ticketManager.loadUserTickets();
                break;
            case 'create-event':
                eventManager.setMinDate();
                break;
        }
    }

    updateActiveNavLink() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scroll to element
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Show loading state
    showLoading(container) {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
    }

    // Show skeleton loading
    showSkeleton(container, type = 'events') {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }

        let skeletonHTML = '';
        
        if (type === 'events') {
            for (let i = 0; i < 6; i++) {
                skeletonHTML += `
                    <div class="event-card">
                        <div class="skeleton skeleton-image"></div>
                        <div class="event-info">
                            <div class="skeleton skeleton-text" style="width: 60px; height: 20px; margin-bottom: 15px;"></div>
                            <div class="skeleton skeleton-title"></div>
                            <div class="skeleton skeleton-text"></div>
                            <div class="skeleton skeleton-text" style="width: 70%;"></div>
                            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                                <div class="skeleton skeleton-text" style="width: 120px;"></div>
                                <div class="skeleton skeleton-text" style="width: 60px;"></div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        container.innerHTML = skeletonHTML;
    }

    // Animate element entrance
    animateIn(element, animation = 'fadeIn') {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }

        element.style.animation = `${animation} 0.5s ease-in-out`;
    }

    // Debounce function for search
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

    // Format numbers with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('Copied to clipboard!', 'success');
        }
    }

    // Get viewport dimensions
    getViewport() {
        return {
            width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
        };
    }

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Lazy load images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Toast notification system
function showToast(message, type = 'info', duration = 4000) {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove toast
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Global function to show pages (for onclick handlers)
function showPage(pageId) {
    uiManager.showPage(pageId);
}

// Initialize UI manager
const uiManager = new UIManager();