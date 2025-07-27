// Main JavaScript file for Lite Tickets

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initImageGallery();
    initFAQ();
    initSmoothScrolling();
    initAnimations();
    initPageSpecific();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}

// Image Gallery Carousel
function initImageGallery() {
    const galleryTrack = document.getElementById('galleryTrack');
    const galleryDots = document.getElementById('galleryDots');

    if (!galleryTrack || !galleryDots) return;

    const slides = galleryTrack.querySelectorAll('.gallery-slide');
    const dots = galleryDots.querySelectorAll('.gallery-dot');
    let currentSlide = 0;

    // Update gallery position
    function updateGallery(slideIndex) {
        // Update track position
        galleryTrack.style.transform = `translateX(-${slideIndex * 100}%)`;

        // Update active slide
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === slideIndex);
        });

        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === slideIndex);
        });

        currentSlide = slideIndex;
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateGallery(index);
        });
    });

    // Auto-advance gallery
    function autoAdvance() {
        const nextSlide = (currentSlide + 1) % slides.length;
        updateGallery(nextSlide);
    }

    // Start auto-advance
    setInterval(autoAdvance, 4000);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const prevSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            updateGallery(prevSlide);
        } else if (e.key === 'ArrowRight') {
            const nextSlide = (currentSlide + 1) % slides.length;
            updateGallery(nextSlide);
        }
    });
}

// FAQ Accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach((question, index) => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items
            faqQuestions.forEach((q, i) => {
                if (i !== index) {
                    q.parentElement.classList.remove('active');
                }
            });

            // Toggle current item
            faqItem.classList.toggle('active', !isActive);
        });
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip empty href or just "#"
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.event-card, .pricing-card, .faq-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Form Validation and Handling
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.parentElement.querySelector('.error-message');

        // Remove existing error
        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('error');

        // Check if field is empty
        if (!value) {
            showFieldError(input, 'This field is required');
            isValid = false;
            return;
        }

        // Email validation
        if (input.type === 'email' && !isValidEmail(value)) {
            showFieldError(input, 'Please enter a valid email address');
            isValid = false;
            return;
        }

        // Password validation
        if (input.type === 'password' && value.length < 8) {
            showFieldError(input, 'Password must be at least 8 characters long');
            isValid = false;
            return;
        }

        // Phone validation
        if (input.type === 'tel' && !isValidPhone(value)) {
            showFieldError(input, 'Please enter a valid phone number');
            isValid = false;
            return;
        }
    });

    return isValid;
}

function showFieldError(input, message) {
    input.classList.add('error');

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    input.parentElement.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Event Search and Filtering (for events page)
function initEventFiltering() {
    const searchInput = document.getElementById('eventSearch');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const eventCards = document.querySelectorAll('.event-card');

    let currentCategory = 'all';
    let currentSearchTerm = '';

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase().trim();
            filterEvents();
        });
    }

    // Category filtering
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active category
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentCategory = this.dataset.category || 'all';
            filterEvents();
        });
    });

    function filterEvents() {
        eventCards.forEach(card => {
            const title = card.querySelector('.event-title').textContent.toLowerCase();
            const description = card.querySelector('.event-description').textContent.toLowerCase();
            const category = card.dataset.category || '';

            const matchesSearch = !currentSearchTerm ||
                title.includes(currentSearchTerm) ||
                description.includes(currentSearchTerm);

            const matchesCategory = currentCategory === 'all' ||
                category === currentCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                card.classList.add('animate-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('animate-in');
            }
        });
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Local Storage Helper Functions
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Unable to save to localStorage:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.warn('Unable to read from localStorage:', e);
        return null;
    }
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize page-specific functionality
function initPageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch(currentPage) {
        case 'events.html':
            initEventFiltering();
            break;
        case 'login.html':
        case 'signup.html':
            initAuthForms();
            break;
        case 'create-event.html':
            initEventCreationForm();
            break;
        case 'event-detail.html':
            initEventDetail();
            break;
    }
}

// Auth Forms
function initAuthForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm(this)) {
                // Simulate form submission
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    showToast('Success! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }, 2000);
            }
        });
    });
}

// Event Creation Form
function initEventCreationForm() {
    const form = document.querySelector('#eventForm');
    if (!form) return;

    // Handle free event toggle
    const freeEventCheckbox = document.getElementById('freeEvent');
    const ticketSection = document.querySelector('.ticket-section');

    if (freeEventCheckbox && ticketSection) {
        freeEventCheckbox.addEventListener('change', function() {
            ticketSection.style.display = this.checked ? 'none' : 'block';
        });
    }

    // Handle location type toggle
    const locationRadios = document.querySelectorAll('input[name="locationType"]');
    const venueSection = document.querySelector('.venue-section');

    locationRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (venueSection) {
                venueSection.style.display = this.value === 'online' ? 'none' : 'block';
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm(this)) {
            showToast('Event created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'events.html';
            }, 2000);
        }
    });
}

// Event Detail Page
function initEventDetail() {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        loadEventDetails(eventId);
    }

    // Initialize ticket purchase
    const purchaseBtn = document.getElementById('purchaseBtn');
    if (purchaseBtn) {
        purchaseBtn.addEventListener('click', function() {
            showToast('Redirecting to checkout...', 'info');
            // Simulate redirect to payment
            setTimeout(() => {
                showToast('Purchase successful!', 'success');
            }, 2000);
        });
    }
}

function loadEventDetails(eventId) {
    // Sample event data - in a real app, this would come from an API
    const events = {
        '1': {
            title: 'Summer Music Festival',
            description: 'Join us for an incredible night of live music featuring top artists from around the world. Experience the magic of live performances under the stars.',
            date: 'Saturday, August 15, 2025',
            time: '7:00 PM',
            location: 'Central Park, NYC',
            price: '$75',
            image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg'
        },
        '2': {
            title: 'Championship Game',
            description: 'Experience the thrill of the championship game with the best seats in the house. Don\'t miss this epic showdown between two legendary teams.',
            date: 'Sunday, August 20, 2025',
            time: '3:00 PM',
            location: 'Madison Square Garden',
            price: '$120',
            image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg'
        },
        '3': {
            title: 'Broadway Show',
            description: 'A spectacular theatrical performance that will leave you mesmerized and wanting more. Experience the magic of Broadway at its finest.',
            date: 'Friday, August 25, 2025',
            time: '8:00 PM',
            location: 'Broadway Theater',
            price: '$95',
            image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg'
        }
    };

    const event = events[eventId];
    if (event) {
        // Update page content with event details
        document.title = `${event.title} - Litevents Tickets`;
        
        const eventTitle = document.getElementById('eventTitle');
        const eventDescription = document.getElementById('eventDescription');
        const eventDate = document.getElementById('eventDate');
        const eventTime = document.getElementById('eventTime');
        const eventLocation = document.getElementById('eventLocation');
        const eventPrice = document.getElementById('eventPrice');
        const eventImage = document.getElementById('eventImage');

        if (eventTitle) eventTitle.textContent = event.title;
        if (eventDescription) eventDescription.textContent = event.description;
        if (eventDate) eventDate.textContent = event.date;
        if (eventTime) eventTime.textContent = event.time;
        if (eventLocation) eventLocation.textContent = event.location;
        if (eventPrice) eventPrice.textContent = event.price;
        if (eventImage) eventImage.src = event.image;
    }
}

// Export functions for use in other scripts
window.PopoutTickets = {
    showToast,
    validateForm,
    saveToLocalStorage,
    getFromLocalStorage,
    debounce,
    throttle
};