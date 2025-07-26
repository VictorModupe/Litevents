// Sample data for the application
const sampleEvents = [
    {
        id: 1,
        title: "Summer Music Festival",
        description: "Join us for an amazing summer music festival featuring top artists from around the world. Experience live music, food trucks, and great vibes.",
        category: "music",
        price: 89.99,
        date: "2024-07-15",
        time: "18:00",
        location: "Central Park, New York",
        capacity: 5000,
        sold: 3200,
        image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "Music Events Co.",
        featured: true
    },
    {
        id: 2,
        title: "Tech Conference 2024",
        description: "The biggest tech conference of the year. Learn from industry leaders, network with professionals, and discover the latest innovations.",
        category: "business",
        price: 299.99,
        date: "2024-08-22",
        time: "09:00",
        location: "Convention Center, San Francisco",
        capacity: 2000,
        sold: 1800,
        image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "TechEvents Inc.",
        featured: true
    },
    {
        id: 3,
        title: "Art Gallery Opening",
        description: "Exclusive opening of contemporary art gallery featuring works from emerging artists. Wine and appetizers included.",
        category: "arts",
        price: 45.00,
        date: "2024-06-30",
        time: "19:00",
        location: "Downtown Gallery, Los Angeles",
        capacity: 150,
        sold: 89,
        image: "https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "Modern Arts Society",
        featured: false
    },
    {
        id: 4,
        title: "Championship Basketball Game",
        description: "Don't miss the championship game of the season! Watch the best teams compete for the ultimate title.",
        category: "sports",
        price: 125.00,
        date: "2024-07-08",
        time: "20:00",
        location: "Sports Arena, Chicago",
        capacity: 15000,
        sold: 14500,
        image: "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "Sports League",
        featured: true
    },
    {
        id: 5,
        title: "Jazz Night at Blue Note",
        description: "Intimate jazz performance featuring renowned musicians. Enjoy classic cocktails and smooth jazz in a cozy atmosphere.",
        category: "music",
        price: 65.00,
        date: "2024-07-03",
        time: "21:00",
        location: "Blue Note Club, New York",
        capacity: 200,
        sold: 180,
        image: "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "Blue Note Entertainment",
        featured: false
    },
    {
        id: 6,
        title: "Startup Pitch Competition",
        description: "Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and industry experts.",
        category: "business",
        price: 75.00,
        date: "2024-08-10",
        time: "14:00",
        location: "Innovation Hub, Austin",
        capacity: 300,
        sold: 245,
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "Startup Accelerator",
        featured: false
    },
    {
        id: 7,
        title: "Food & Wine Festival",
        description: "Celebrate culinary excellence with top chefs, wine tastings, and gourmet food from around the world.",
        category: "arts",
        price: 95.00,
        date: "2024-09-15",
        time: "12:00",
        location: "Waterfront Park, Seattle",
        capacity: 1000,
        sold: 750,
        image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "Culinary Arts Foundation",
        featured: true
    },
    {
        id: 8,
        title: "Marathon Championship",
        description: "Join thousands of runners in the annual marathon championship. Multiple categories available for all skill levels.",
        category: "sports",
        price: 55.00,
        date: "2024-10-05",
        time: "07:00",
        location: "City Center, Boston",
        capacity: 10000,
        sold: 8500,
        image: "https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800",
        organizer: "Marathon Association",
        featured: false
    }
];

// User data structure
let currentUser = null;
let users = JSON.parse(localStorage.getItem('popout_users') || '[]');
let events = JSON.parse(localStorage.getItem('popout_events') || JSON.stringify(sampleEvents));
let tickets = JSON.parse(localStorage.getItem('popout_tickets') || '[]');

// Save data to localStorage
function saveData() {
    localStorage.setItem('popout_users', JSON.stringify(users));
    localStorage.setItem('popout_events', JSON.stringify(events));
    localStorage.setItem('popout_tickets', JSON.stringify(tickets));
}

// Get events with filters
function getEvents(filters = {}) {
    let filteredEvents = [...events];
    
    if (filters.category) {
        filteredEvents = filteredEvents.filter(event => event.category === filters.category);
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filters.date) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        filteredEvents = filteredEvents.filter(event => {
            const eventDate = new Date(event.date);
            
            switch (filters.date) {
                case 'today':
                    return eventDate.toDateString() === today.toDateString();
                case 'tomorrow':
                    return eventDate.toDateString() === tomorrow.toDateString();
                case 'this-week':
                    const weekFromNow = new Date(today);
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return eventDate >= today && eventDate <= weekFromNow;
                case 'this-month':
                    return eventDate.getMonth() === today.getMonth() && 
                           eventDate.getFullYear() === today.getFullYear();
                default:
                    return true;
            }
        });
    }
    
    return filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Get featured events
function getFeaturedEvents() {
    return events.filter(event => event.featured).slice(0, 6);
}

// Get event by ID
function getEventById(id) {
    return events.find(event => event.id === parseInt(id));
}

// Add new event
function addEvent(eventData) {
    const newEvent = {
        id: Date.now(),
        ...eventData,
        sold: 0,
        organizer: currentUser ? currentUser.name : 'Anonymous',
        featured: false
    };
    
    events.push(newEvent);
    saveData();
    return newEvent;
}

// Get user tickets
function getUserTickets(userId) {
    return tickets.filter(ticket => ticket.userId === userId);
}

// Add ticket
function addTicket(ticketData) {
    const newTicket = {
        id: Date.now(),
        ...ticketData,
        purchaseDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    tickets.push(newTicket);
    
    // Update event sold count
    const event = getEventById(ticketData.eventId);
    if (event) {
        event.sold += ticketData.quantity;
    }
    
    saveData();
    return newTicket;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Format price for display
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Generate random ticket ID
function generateTicketId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}