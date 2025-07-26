// Ticket management functionality
class TicketManager {
    constructor() {
        this.currentPurchase = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserTickets();
    }

    bindEvents() {
        // Purchase form
        document.getElementById('purchase-form').addEventListener('submit', (e) => {
            this.handlePurchase(e);
        });

        // Quantity change
        document.getElementById('ticket-quantity').addEventListener('input', (e) => {
            this.updateTotal();
        });

        // Close purchase modal
        document.getElementById('close-purchase-modal').addEventListener('click', () => {
            this.closePurchaseModal();
        });

        // Click outside modal to close
        document.getElementById('purchase-modal').addEventListener('click', (e) => {
            if (e.target.id === 'purchase-modal') {
                this.closePurchaseModal();
            }
        });

        // Format card number input
        document.getElementById('card-number').addEventListener('input', (e) => {
            this.formatCardNumber(e);
        });

        // Format expiry date input
        document.getElementById('expiry-date').addEventListener('input', (e) => {
            this.formatExpiryDate(e);
        });

        // Format CVV input
        document.getElementById('cvv').addEventListener('input', (e) => {
            this.formatCVV(e);
        });
    }

    showPurchaseModal(eventId) {
        // Check if user is logged in
        if (!authManager.isLoggedIn()) {
            showToast('Please login to purchase tickets', 'warning');
            authManager.showAuthModal('login');
            return;
        }

        const event = getEventById(eventId);
        if (!event) return;

        const availability = event.capacity - event.sold;
        if (availability <= 0) {
            showToast('Sorry, this event is sold out', 'error');
            return;
        }

        this.currentPurchase = { event, availability };
        
        const modal = document.getElementById('purchase-modal');
        const detailsContainer = document.getElementById('purchase-details');
        const quantityInput = document.getElementById('ticket-quantity');

        // Set max quantity
        quantityInput.max = Math.min(10, availability);
        quantityInput.value = 1;

        detailsContainer.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${formatDate(event.date)} at ${formatTime(event.time)}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Price per ticket:</strong> ${formatPrice(event.price)}</p>
            <p><strong>Available tickets:</strong> ${availability}</p>
        `;

        this.updateTotal();
        modal.classList.add('active');
    }

    closePurchaseModal() {
        const modal = document.getElementById('purchase-modal');
        modal.classList.remove('active');
        this.currentPurchase = null;
        
        // Reset form
        document.getElementById('purchase-form').reset();
    }

    updateTotal() {
        if (!this.currentPurchase) return;

        const quantity = parseInt(document.getElementById('ticket-quantity').value) || 1;
        const total = this.currentPurchase.event.price * quantity;
        
        document.getElementById('total-amount').textContent = total.toFixed(2);
    }

    handlePurchase(e) {
        e.preventDefault();

        if (!this.currentPurchase || !authManager.isLoggedIn()) {
            showToast('Invalid purchase request', 'error');
            return;
        }

        // Get form data
        const quantity = parseInt(document.getElementById('ticket-quantity').value);
        const cardholderName = document.getElementById('cardholder-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;

        // Validate form
        if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
            showToast('Please fill in all payment details', 'error');
            return;
        }

        if (!this.validateCardNumber(cardNumber)) {
            showToast('Please enter a valid card number', 'error');
            return;
        }

        if (!this.validateExpiryDate(expiryDate)) {
            showToast('Please enter a valid expiry date', 'error');
            return;
        }

        if (!this.validateCVV(cvv)) {
            showToast('Please enter a valid CVV', 'error');
            return;
        }

        // Check availability
        if (quantity > this.currentPurchase.availability) {
            showToast('Not enough tickets available', 'error');
            return;
        }

        // Simulate payment processing
        this.processPayment(quantity);
    }

    processPayment(quantity) {
        // Show loading state
        const submitBtn = document.querySelector('#purchase-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        // Simulate payment delay
        setTimeout(() => {
            try {
                // Create ticket
                const ticketData = {
                    userId: authManager.currentUser.id,
                    eventId: this.currentPurchase.event.id,
                    eventTitle: this.currentPurchase.event.title,
                    eventDate: this.currentPurchase.event.date,
                    eventTime: this.currentPurchase.event.time,
                    eventLocation: this.currentPurchase.event.location,
                    quantity: quantity,
                    totalPrice: this.currentPurchase.event.price * quantity,
                    ticketId: generateTicketId()
                };

                const newTicket = addTicket(ticketData);

                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Close modal and show success
                this.closePurchaseModal();
                showToast(`Successfully purchased ${quantity} ticket(s)!`, 'success');

                // Refresh events to update availability
                eventManager.loadAllEvents();
                eventManager.loadFeaturedEvents();

                // Refresh user tickets if on that page
                if (document.querySelector('#my-tickets-page.active')) {
                    this.loadUserTickets();
                }

            } catch (error) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                showToast('Payment failed. Please try again.', 'error');
            }
        }, 2000);
    }

    loadUserTickets() {
        if (!authManager.isLoggedIn()) {
            const container = document.getElementById('tickets-container');
            container.innerHTML = '<div class="empty-state"><h3>Please login</h3><p>Login to view your tickets</p></div>';
            return;
        }

        const userTickets = getUserTickets(authManager.currentUser.id);
        const container = document.getElementById('tickets-container');

        if (userTickets.length === 0) {
            container.innerHTML = '<div class="empty-state"><h3>No tickets yet</h3><p>Purchase tickets to see them here</p><button class="btn btn-primary mt-20" onclick="showPage(\'events\')">Browse Events</button></div>';
            return;
        }

        container.innerHTML = userTickets.map(ticket => this.createTicketCard(ticket)).join('');
    }

    createTicketCard(ticket) {
        const eventDate = new Date(ticket.eventDate);
        const isPastEvent = eventDate < new Date();
        
        return `
            <div class="ticket-card">
                <div class="ticket-info">
                    <h3>${ticket.eventTitle}</h3>
                    <div class="ticket-details">
                        <p><strong>Date:</strong> ${formatDate(ticket.eventDate)} at ${formatTime(ticket.eventTime)}</p>
                        <p><strong>Location:</strong> ${ticket.eventLocation}</p>
                        <p><strong>Quantity:</strong> ${ticket.quantity} ticket(s)</p>
                        <p><strong>Total Paid:</strong> ${formatPrice(ticket.totalPrice)}</p>
                        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
                        <p><strong>Purchase Date:</strong> ${formatDate(ticket.purchaseDate.split('T')[0])}</p>
                    </div>
                    <span class="ticket-status ${ticket.status}">${ticket.status}</span>
                    ${isPastEvent ? '<span class="badge badge-warning">Past Event</span>' : '<span class="badge badge-success">Upcoming</span>'}
                </div>
                <div class="ticket-qr">
                    📱
                </div>
            </div>
        `;
    }

    // Input formatting functions
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substr(0, 19);
        }
        
        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    }

    formatCVV(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.substring(0, 4);
    }

    // Validation functions
    validateCardNumber(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
    }

    validateExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        if (!month || !year) return false;
        
        const monthNum = parseInt(month);
        const yearNum = parseInt('20' + year);
        
        if (monthNum < 1 || monthNum > 12) return false;
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        
        if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
            return false;
        }
        
        return true;
    }

    validateCVV(cvv) {
        return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv);
    }
}

// Initialize ticket manager
const ticketManager = new TicketManager();