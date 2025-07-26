// Events functionality
class EventManager {
    constructor() {
        this.currentEvent = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadFeaturedEvents();
        this.loadAllEvents();
    }

    bindEvents() {
        // Search functionality
        document.getElementById('hero-search').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('events-search').addEventListener('input', (e) => {
            this.filterEvents();
        });

        // Filter functionality
        document.getElementById('category-filter').addEventListener('change', () => {
            this.filterEvents();
        });

        document.getElementById('date-filter').addEventListener('change', () => {
            this.filterEvents();
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Create event form
        document.getElementById('create-event-form').addEventListener('submit', (e) => {
            this.handleCreateEvent(e);
        });

        // Event modal close
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeEventModal();
        });

        // Click outside modal to close
        document.getElementById('event-modal').addEventListener('click', (e) => {
            if (e.target.id === 'event-modal') {
                this.closeEventModal();
            }
        });
    }

    loadFeaturedEvents() {
        const featuredEvents = getFeaturedEvents();
        const container = document.getElementById('featured-events-grid');
        
        if (featuredEvents.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No featured events</h3><p>Check back later for featured events</p></div>';
            return;
        }

        container.innerHTML = featuredEvents.map(event => this.createEventCard(event)).join('');
        this.bindEventCardListeners(container);
    }

    loadAllEvents() {
        const allEvents = getEvents();
        const container = document.getElementById('all-events-grid');
        
        if (allEvents.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No events found</h3><p>Be the first to create an event!</p></div>';
            return;
        }

        container.innerHTML = allEvents.map(event => this.createEventCard(event)).join('');
        this.bindEventCardListeners(container);
    }

    createEventCard(event) {
        const availability = event.capacity - event.sold;
        const soldOutClass = availability <= 0 ? 'sold-out' : '';
        
        return `
            <div class="event-card ${soldOutClass}" data-event-id="${event.id}">
                <img src="${event.image}" alt="${event.title}" class="event-image">
                <div class="event-info">
                    <span class="event-category">${event.category}</span>
                    <h3 class="event-title">${event.title}</h3>
                    <p class="event-description">${event.description}</p>
                    <div class="event-meta">
                        <div>
                            <div class="event-date">${formatDate(event.date)}</div>
                            <div class="event-location">${event.location}</div>
                        </div>
                        <div class="event-price">${formatPrice(event.price)}</div>
                    </div>
                    ${availability <= 0 ? '<div class="sold-out-badge">Sold Out</div>' : ''}
                    <div class="event-availability">
                        ${availability} tickets remaining
                    </div>
                </div>
            </div>
        `;
    }

    bindEventCardListeners(container) {
        container.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => {
                const eventId = card.dataset.eventId;
                this.showEventDetails(eventId);
            });
        });
    }

    showEventDetails(eventId) {
        const event = getEventById(eventId);
        if (!event) return;

        this.currentEvent = event;
        const modal = document.getElementById('event-modal');
        const detailsContainer = document.getElementById('event-details');
        
        const availability = event.capacity - event.sold;
        const soldOut = availability <= 0;

        detailsContainer.innerHTML = `
            <img src="${event.image}" alt="${event.title}">
            <span class="event-category">${event.category}</span>
            <h2>${event.title}</h2>
            <p>${event.description}</p>
            
            <div class="event-details-grid">
                <div class="detail-item">
                    <strong>Date</strong>
                    <span>${formatDate(event.date)}</span>
                </div>
                <div class="detail-item">
                    <strong>Time</strong>
                    <span>${formatTime(event.time)}</span>
                </div>
                <div class="detail-item">
                    <strong>Location</strong>
                    <span>${event.location}</span>
                </div>
                <div class="detail-item">
                    <strong>Price</strong>
                    <span>${formatPrice(event.price)}</span>
                </div>
                <div class="detail-item">
                    <strong>Organizer</strong>
                    <span>${event.organizer}</span>
                </div>
                <div class="detail-item">
                    <strong>Availability</strong>
                    <span>${availability} / ${event.capacity} tickets</span>
                </div>
            </div>
            
            <div class="event-actions">
                ${soldOut ? 
                    '<button class="btn btn-outline btn-full" disabled>Sold Out</button>' :
                    '<button class="btn btn-primary btn-full" onclick="ticketManager.showPurchaseModal(' + event.id + ')">Buy Tickets</button>'
                }
            </div>
        `;

        modal.classList.add('active');
    }

    closeEventModal() {
        const modal = document.getElementById('event-modal');
        modal.classList.remove('active');
        this.currentEvent = null;
    }

    handleSearch(query) {
        if (query.trim() === '') return;
        
        // Switch to events page and filter
        showPage('events');
        document.getElementById('events-search').value = query;
        this.filterEvents();
    }

    filterEvents() {
        const category = document.getElementById('category-filter').value;
        const date = document.getElementById('date-filter').value;
        const search = document.getElementById('events-search').value;

        const filters = {};
        if (category) filters.category = category;
        if (date) filters.date = date;
        if (search) filters.search = search;

        const filteredEvents = getEvents(filters);
        const container = document.getElementById('all-events-grid');

        if (filteredEvents.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No events found</h3><p>Try adjusting your filters</p></div>';
            return;
        }

        container.innerHTML = filteredEvents.map(event => this.createEventCard(event)).join('');
        this.bindEventCardListeners(container);
    }

    filterByCategory(category) {
        showPage('events');
        document.getElementById('category-filter').value = category;
        this.filterEvents();
    }

    handleCreateEvent(e) {
        e.preventDefault();

        // Check if user is logged in
        if (!authManager.isLoggedIn()) {
            showToast('Please login to create an event', 'warning');
            authManager.showAuthModal('login');
            return;
        }

        // Get form data
        const formData = new FormData(e.target);
        const eventData = {
            title: document.getElementById('event-title').value,
            description: document.getElementById('event-description').value,
            category: document.getElementById('event-category').value,
            price: parseFloat(document.getElementById('event-price').value),
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            location: document.getElementById('event-location').value,
            capacity: parseInt(document.getElementById('event-capacity').value),
            image: document.getElementById('event-image').value || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800'
        };

        // Validate required fields
        const requiredFields = ['title', 'description', 'category', 'price', 'date', 'time', 'location', 'capacity'];
        const missingFields = requiredFields.filter(field => !eventData[field]);

        if (missingFields.length > 0) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        // Validate date is in the future
        const eventDate = new Date(eventData.date + 'T' + eventData.time);
        if (eventDate <= new Date()) {
            showToast('Event date must be in the future', 'error');
            return;
        }

        // Create event
        const newEvent = addEvent(eventData);
        
        // Reset form
        e.target.reset();
        
        // Show success message and redirect
        showToast('Event created successfully!', 'success');
        setTimeout(() => {
            showPage('events');
            this.loadAllEvents();
        }, 1000);
    }

    // Set minimum date for event creation to today
    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('event-date').min = today;
    }
}

// Initialize event manager
const eventManager = new EventManager();

// Set minimum date when page loads
document.addEventListener('DOMContentLoaded', () => {
    eventManager.setMinDate();
});