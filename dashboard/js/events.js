// Events page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('event-search');
    const filterSelect = document.getElementById('event-filter');
    const eventsList = document.getElementById('events-list');

    // Mock events data
    const eventsData = [
        {
            id: '1',
            title: 'Summer Music Festival',
            date: 'Aug 15, 2025',
            status: 'active',
            ticketsSold: 450,
            totalTickets: 500,
            revenue: '₦225,000',
            image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: '2',
            title: 'Tech Conference 2025',
            date: 'Aug 20, 2025',
            status: 'active',
            ticketsSold: 230,
            totalTickets: 300,
            revenue: '₦345,000',
            image: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: '3',
            title: 'Art Gallery Opening',
            date: 'Aug 25, 2025',
            status: 'draft',
            ticketsSold: 0,
            totalTickets: 150,
            revenue: '₦0',
            image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
            id: '4',
            title: 'Food Festival 2024',
            date: 'Dec 10, 2024',
            status: 'ended',
            ticketsSold: 200,
            totalTickets: 200,
            revenue: '₦150,000',
            image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
    ];

    // Render events
    function renderEvents(events) {
        if (events.length === 0) {
            eventsList.innerHTML = `
                <div class="no-events">
                    <div class="no-events-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                    </div>
                    <h3>No events found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        eventsList.innerHTML = events.map(event => {
            const progressPercentage = Math.round((event.ticketsSold / event.totalTickets) * 100);
            
            return `
                <div class="event-list-card" data-event-id="${event.id}">
                    <div class="event-image-small">
                        <img src="${event.image}" alt="${event.title}" loading="lazy">
                    </div>
                    <div class="event-details">
                        <div class="event-header">
                            <h3>${event.title}</h3>
                            <span class="status-badge ${event.status}">${event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span>
                        </div>
                        <p class="event-date">${event.date}</p>
                        <div class="event-metrics">
                            <div class="metric">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                <span>${event.ticketsSold}/${event.totalTickets}</span>
                            </div>
                            <div class="metric">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <line x1="12" y1="1" x2="12" y2="23"/>
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                                </svg>
                                <span>${event.revenue}</span>
                            </div>
                            <div class="metric progress-metric">
                                <div class="progress-bar-small">
                                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                                </div>
                                <span>${progressPercentage}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-outline btn-sm" onclick="editEvent('${event.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="viewEvent('${event.id}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            View
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add animation to new cards
        const cards = eventsList.querySelectorAll('.event-list-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Filter events
    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const statusFilter = filterSelect.value;

        const filteredEvents = eventsData.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.date.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        renderEvents(filteredEvents);
    }

    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterEvents, 300));
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', filterEvents);
    }

    // Debounce function
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

    // Event actions
    window.editEvent = function(eventId) {
        // In a real app, this would navigate to the edit event page
        showNotification(`Editing event ${eventId}`, 'success');
        console.log('Edit event:', eventId);
    };

    window.viewEvent = function(eventId) {
        // In a real app, this would show event details
        showNotification(`Viewing event ${eventId}`, 'success');
        console.log('View event:', eventId);
    };

    window.deleteEvent = function(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            showNotification('Event deleted successfully', 'success');
            console.log('Delete event:', eventId);
        }
    };

    // Add CSS for additional elements
    const eventsStyle = document.createElement('style');
    eventsStyle.textContent = `
        .no-events {
            text-align: center;
            padding: 4rem 2rem;
            background: var(--gradient-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            box-shadow: var(--shadow-card);
        }
        
        .no-events-icon {
            width: 64px;
            height: 64px;
            background: hsla(260, 100%, 66%, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
        }
        
        .no-events-icon svg {
            width: 32px;
            height: 32px;
            stroke: var(--muted-foreground);
        }
        
        .no-events h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--foreground);
            margin-bottom: 0.5rem;
        }
        
        .no-events p {
            color: var(--muted-foreground);
        }
        
        .event-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-self: flex-start;
            margin-top: 1rem;
        }
        
        .btn-sm {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
        }
        
        .btn-sm svg {
            width: 14px;
            height: 14px;
        }
        
        @media (min-width: 768px) {
            .event-list-card {
                align-items: center;
            }
            
            .event-actions {
                flex-direction: row;
                margin-top: 0;
                margin-left: auto;
            }
        }
    `;
    document.head.appendChild(eventsStyle);

    // Initial render
    renderEvents(eventsData);

    console.log('Events page initialized');
});