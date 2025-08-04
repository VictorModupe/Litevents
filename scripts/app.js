// App State
let currentUser = null;
let currentPage = 'upcoming-events';
let sidebarCollapsed = false;

// Nigerian Banks Data
const nigerianBanks = {
    'access': 'Access Bank',
    'gtb': 'Guaranty Trust Bank',
    'zenith': 'Zenith Bank',
    'uba': 'United Bank for Africa',
    'firstbank': 'First Bank of Nigeria',
    'fidelity': 'Fidelity Bank',
    'union': 'Union Bank',
    'stanbic': 'Stanbic IBTC Bank'
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

function initializeApp() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('eventTicketUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLoginPage();
    }
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Navigation items
    setupNavigation();

    // Settings tabs
    setupSettingsTabs();

    // Create event form
    const createEventForm = document.getElementById('create-event-form');
    if (createEventForm) {
        createEventForm.addEventListener('submit', handleCreateEvent);
    }

    // Transaction filter
    const transactionFilter = document.getElementById('transaction-filter');
    if (transactionFilter) {
        transactionFilter.addEventListener('change', handleTransactionFilter);
    }
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('eventTicketUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInfo();
    }
}

// Authentication Functions
function handleLogin(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const accountNumber = document.getElementById('accountNumber').value;
    const bank = document.getElementById('bank').value;

    // Validate inputs
    if (!fullName || !accountNumber || !bank) {
        alert('Please fill in all fields');
        return;
    }

    if (accountNumber.length !== 10) {
        alert('Account number must be exactly 10 digits');
        return;
    }

    // Simulate bank verification
    const userData = {
        fullName,
        accountNumber,
        bank,
        bankName: nigerianBanks[bank],
        loginTime: new Date().toISOString()
    };

    // Save user data
    localStorage.setItem('eventTicketUser', JSON.stringify(userData));
    currentUser = userData;

    // Show success and redirect
    alert('Bank details verified successfully!');
    showDashboard();
}

function showLoginPage() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    updateUserInfo();
    showPage('upcoming-events');
}

function updateUserInfo() {
    if (currentUser) {
        // Update linked bank in wallet
        const linkedBank = document.getElementById('linked-bank');
        const linkedAccount = document.getElementById('linked-account');
        
        if (linkedBank) {
            linkedBank.textContent = currentUser.bankName;
        }
        
        if (linkedAccount) {
            linkedAccount.textContent = `**** **** **${currentUser.accountNumber.slice(-4)}`;
        }

        // Update settings form
        const settingsName = document.getElementById('settings-name');
        const settingsBank = document.getElementById('settings-bank');
        const settingsAccount = document.getElementById('settings-account');

        if (settingsName) settingsName.value = currentUser.fullName;
        if (settingsBank) settingsBank.value = currentUser.bank;
        if (settingsAccount) settingsAccount.value = currentUser.accountNumber;
    }
}

// Navigation Functions
function setupNavigation() {
    // Main nav items
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            showPage(page);
        });
    });

    // Events section toggle
    const eventsNavItem = document.querySelector('.nav-item[data-section="events"]');
    const eventsSubmenu = document.getElementById('events-submenu');
    
    if (eventsNavItem && eventsSubmenu) {
        eventsNavItem.addEventListener('click', function() {
            this.classList.toggle('expanded');
            eventsSubmenu.classList.toggle('open');
        });
    }

    // Submenu items
    document.querySelectorAll('.nav-subitem[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const page = this.dataset.page;
            showPage(page);
        });
    });
}

function showPage(pageName) {
    // Hide all content pages
    document.querySelectorAll('.content-page').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.style.display = 'block';
        currentPage = pageName;
    }

    // Update navigation active states
    updateNavigationState(pageName);
}

function updateNavigationState(pageName) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item, .nav-subitem').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current page
    const activeItem = document.querySelector(`[data-page="${pageName}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
        
        // If it's a submenu item, also expand the parent
        if (activeItem.classList.contains('nav-subitem')) {
            const eventsNavItem = document.querySelector('.nav-item[data-section="events"]');
            const eventsSubmenu = document.getElementById('events-submenu');
            
            if (eventsNavItem && eventsSubmenu) {
                eventsNavItem.classList.add('expanded');
                eventsSubmenu.classList.add('open');
            }
        }
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    sidebarCollapsed = !sidebarCollapsed;
}

// Settings Functions
function setupSettingsTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            showSettingsTab(tabName);
        });
    });
}

function showSettingsTab(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });

    // Show selected tab
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);

    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.style.display = 'block';
}

// Event Management Functions
function handleCreateEvent(e) {
    e.preventDefault();
    
    const eventData = {
        name: document.getElementById('eventName').value,
        date: document.getElementById('eventDate').value,
        venue: document.getElementById('eventVenue').value,
        capacity: parseInt(document.getElementById('eventCapacity').value),
        ticketPrice: parseFloat(document.getElementById('ticketPrice').value),
        category: document.getElementById('eventCategory').value,
        description: document.getElementById('eventDescription').value,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.fullName || 'Unknown'
    };

    // Save event (in real app, this would be sent to server)
    let events = JSON.parse(localStorage.getItem('userEvents') || '[]');
    events.push(eventData);
    localStorage.setItem('userEvents', JSON.stringify(events));

    alert('Event created successfully!');
    
    // Reset form
    document.getElementById('create-event-form').reset();
    
    // Navigate to events page
    showPage('upcoming-events');
}

// Wallet Functions
function handleTransactionFilter(e) {
    const filterValue = e.target.value;
    const transactions = document.querySelectorAll('.transaction-item');
    
    transactions.forEach(transaction => {
        if (filterValue === 'all') {
            transaction.style.display = 'flex';
        } else if (filterValue === 'credit' && transaction.classList.contains('credit')) {
            transaction.style.display = 'flex';
        } else if (filterValue === 'debit' && transaction.classList.contains('debit')) {
            transaction.style.display = 'flex';
        } else {
            transaction.style.display = 'none';
        }
    });
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Sample data functions (for demo purposes)
function generateSampleEvents() {
    const sampleEvents = [
        {
            name: 'Summer Music Festival',
            date: '2024-07-15T18:00',
            venue: 'Central Park, Lagos',
            capacity: 2000,
            sold: 1234,
            revenue: 2468000,
            category: 'music'
        },
        {
            name: 'Comedy Night Show',
            date: '2024-08-20T20:00',
            venue: 'Terra Kulture, Victoria Island',
            capacity: 800,
            sold: 456,
            revenue: 912000,
            category: 'comedy'
        }
    ];
    
    return sampleEvents;
}

// Mobile responsiveness
function handleMobileMenu() {
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
        
        // Add mobile menu toggle functionality
        document.getElementById('sidebar-toggle').addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
}

// Initialize mobile menu handling
window.addEventListener('resize', handleMobileMenu);
handleMobileMenu();