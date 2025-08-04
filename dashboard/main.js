// Dashboard Application Main Script

// Global State
interface User {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  bank: string;
  accountName: string;
  balance: number;
}

interface Event {
  id: string;
  name: string;
  description: string;
  link: string;
  location: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  image?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  reason?: string;
}

class DashboardApp {
  private currentUser: User | null = null;
  private events: Event[] = [];
  private withdrawalRequests: WithdrawalRequest[] = [];
  private currentPage: string = 'dashboard';

  constructor() {
    this.init();
  }

  private init(): void {
    // Show loading screen
    this.showLoading();

    // Initialize after DOM is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  private setup(): void {
    // Hide loading screen after a short delay
    setTimeout(() => {
      this.hideLoading();
      this.initializeApp();
    }, 1000);
  }

  private initializeApp(): void {
    // Check if user is logged in
    this.loadUserData();

    // Setup event listeners
    this.setupEventListeners();

    // Setup routing
    this.setupRouting();

    // Load initial page
    this.checkAuthentication();
  }

  private showLoading(): void {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.add('show');
    }
  }

  private hideLoading(): void {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.classList.remove('show');
    }
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('popout_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }

    const eventsData = localStorage.getItem('popout_events');
    if (eventsData) {
      this.events = JSON.parse(eventsData);
    }

    const withdrawalsData = localStorage.getItem('popout_withdrawals');
    if (withdrawalsData) {
      this.withdrawalRequests = JSON.parse(withdrawalsData);
    }
  }

  private saveUserData(): void {
    if (this.currentUser) {
      localStorage.setItem('popout_user', JSON.stringify(this.currentUser));
    }
    localStorage.setItem('popout_events', JSON.stringify(this.events));
    localStorage.setItem('popout_withdrawals', JSON.stringify(this.withdrawalRequests));
  }

  private checkAuthentication(): void {
    if (this.currentUser) {
      this.showDashboard();
      this.updateDashboardData();
    } else {
      this.showAuth();
    }
  }

  private showAuth(): void {
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (authContainer && dashboardContainer) {
      authContainer.style.display = 'flex';
      dashboardContainer.style.display = 'none';
    }
  }

  private showDashboard(): void {
    const authContainer = document.getElementById('auth-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (authContainer && dashboardContainer) {
      authContainer.style.display = 'none';
      dashboardContainer.classList.add('active');
    }
  }

  private setupEventListeners(): void {
    // Authentication forms
    this.setupAuthForms();

    // Dashboard navigation
    this.setupNavigation();

    // Mobile sidebar toggle
    this.setupMobileToggle();

    // Create event form
    this.setupCreateEventForm();

    // Settings form
    this.setupSettingsForm();

    // Withdraw form
    this.setupWithdrawForm();

    // File upload
    this.setupFileUpload();
  }

  private setupAuthForms(): void {
    // Login form
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Signup form
    const signupForm = document.getElementById('signup-form') as HTMLFormElement;
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }

    // Forgot password form
    const forgotForm = document.getElementById('forgot-form') as HTMLFormElement;
    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
    }

    // Auth navigation links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]') as HTMLAnchorElement;

      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');

        if (href === '#login') {
          this.showAuthPage('login-page');
        } else if (href === '#signup') {
          this.showAuthPage('signup-page');
        } else if (href === '#forgot-password') {
          this.showAuthPage('forgot-page');
        }
      }
    });
  }

  private showAuthPage(pageId: string): void {
    // Hide all auth pages
    const authPages = document.querySelectorAll('.auth-page');
    authPages.forEach(page => page.classList.remove('active'));

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  }

  private handleLogin(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    // Simple validation
    if (!email || !password) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    // Simulate login (in real app, this would be an API call)
    this.simulateLogin(email, password);
  }

  private simulateLogin(email: string, password: string): void {
    // Create demo user
    this.currentUser = {
      id: '1',
      name: 'Victor Modupe',
      email: email,
      accountNumber: '8159040537',
      bank: 'gtbank',
      accountName: 'VICTOR OLUWATOMISIN MODUPE',
      balance: 0
    };

    this.saveUserData();
    this.showToast('Login successful!', 'success');

    setTimeout(() => {
      this.showDashboard();
      this.updateDashboardData();
    }, 1000);
  }

  private handleSignup(e: Event): void {
    e.preventDefault();

    const name = (document.getElementById('signup-name') as HTMLInputElement).value;
    const email = (document.getElementById('signup-email') as HTMLInputElement).value;
    const password = (document.getElementById('signup-password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('signup-confirm') as HTMLInputElement).value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      this.showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      this.showToast('Password must be at least 6 characters', 'error');
      return;
    }

    // Create user
    this.currentUser = {
      id: '1',
      name: name,
      email: email,
      accountNumber: '',
      bank: '',
      accountName: '',
      balance: 0
    };

    this.saveUserData();
    this.showToast('Account created successfully!', 'success');

    setTimeout(() => {
      this.showDashboard();
      this.updateDashboardData();
    }, 1000);
  }

  private handleForgotPassword(e: Event): void {
    e.preventDefault();

    const email = (document.getElementById('forgot-email') as HTMLInputElement).value;

    if (!email) {
      this.showToast('Please enter your email', 'error');
      return;
    }

    this.showToast('Password reset link sent to your email!', 'success');

    setTimeout(() => {
      this.showAuthPage('login-page');
    }, 2000);
  }

  private setupNavigation(): void {
    const navItems = document.querySelectorAll('.nav-item[data-page]');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = (item as HTMLElement).dataset.page;
        if (page) {
          this.navigateToPage(page);
        }
      });
    });
  }

  private navigateToPage(page: string): void {
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    navItems.forEach(item => item.classList.remove('active'));

    const activeNavItem = document.querySelector(`[data-page="${page}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }

    // Show page
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = page;
    }

    // Close mobile sidebar
    this.closeMobileSidebar();
  }

  private setupMobileToggle(): void {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => this.toggleMobileSidebar());
    }

    if (sidebarOverlay) {
      sidebarOverlay.addEventListener('click', () => this.closeMobileSidebar());
    }
  }

  private toggleMobileSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar && overlay) {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('show');
    }
  }

  private closeMobileSidebar(): void {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (sidebar && overlay) {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('show');
    }
  }

  private setupCreateEventForm(): void {
    const form = document.getElementById('create-event-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleCreateEvent(e));
    }
  }

  private handleCreateEvent(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const eventData = {
      id: Date.now().toString(),
      name: (document.getElementById('event-name') as HTMLInputElement).value,
      description: (document.getElementById('event-description') as HTMLTextAreaElement).value,
      link: (document.getElementById('event-link') as HTMLInputElement).value,
      location: (document.getElementById('event-location') as HTMLInputElement).value,
      category: (document.getElementById('event-category') as HTMLSelectElement).value,
      date: (document.getElementById('event-date') as HTMLInputElement).value,
      startTime: (document.getElementById('event-start-time') as HTMLInputElement).value,
      endTime: (document.getElementById('event-end-time') as HTMLInputElement).value,
      status: 'upcoming' as const
    };

    // Validation
    if (!eventData.name || !eventData.description || !eventData.location ||
        !eventData.category || !eventData.date || !eventData.startTime || !eventData.endTime) {
      this.showToast('Please fill in all required fields', 'error');
      return;
    }

    // Add event
    this.events.push(eventData);
    this.saveUserData();
    this.showToast('Event created successfully!', 'success');

    // Reset form
    form.reset();

    // Navigate to events page
    setTimeout(() => {
      this.navigateToPage('events');
      this.updateEventsDisplay();
    }, 1000);
  }

  private setupSettingsForm(): void {
    const form = document.getElementById('settings-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleSaveSettings(e));
    }
  }

  private handleSaveSettings(e: Event): void {
    e.preventDefault();

    if (!this.currentUser) return;

    const name = (document.getElementById('settings-name') as HTMLInputElement).value;
    const email = (document.getElementById('settings-email') as HTMLInputElement).value;
    const accountNumber = (document.getElementById('settings-account-number') as HTMLInputElement).value;
    const bank = (document.getElementById('settings-bank') as HTMLSelectElement).value;
    const accountName = (document.getElementById('settings-account-name') as HTMLInputElement).value;

    // Update user data
    this.currentUser.name = name;
    this.currentUser.email = email;
    this.currentUser.accountNumber = accountNumber;
    this.currentUser.bank = bank;
    this.currentUser.accountName = accountName;

    this.saveUserData();
    this.showToast('Settings saved successfully!', 'success');
    this.updateDashboardData();
  }

  private setupWithdrawForm(): void {
    const form = document.getElementById('withdraw-form') as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', (e) => this.handleWithdraw(e));
    }
  }

  private handleWithdraw(e: Event): void {
    e.preventDefault();

    const amount = parseFloat((document.getElementById('withdraw-amount') as HTMLInputElement).value);

    if (!amount || amount < 100) {
      this.showToast('Minimum withdrawal amount is ₦100', 'error');
      return;
    }

    if (!this.currentUser || amount > this.currentUser.balance) {
      this.showToast('Insufficient balance', 'error');
      return;
    }

    // Create withdrawal request
    const withdrawal: WithdrawalRequest = {
      id: Date.now().toString(),
      amount: amount,
      status: 'pending',
      date: new Date().toISOString()
    };

    this.withdrawalRequests.push(withdrawal);
    this.saveUserData();
    this.showToast('Withdrawal request submitted!', 'success');

    // Close modal and reset form
    this.closeModal('withdraw-modal');
    (document.getElementById('withdraw-form') as HTMLFormElement).reset();

    // Update displays
    this.updateWithdrawalsDisplay();
  }

  private setupFileUpload(): void {
    const fileUpload = document.getElementById('file-upload');
    const fileInput = document.getElementById('event-image') as HTMLInputElement;

    if (fileUpload && fileInput) {
      fileUpload.addEventListener('click', () => fileInput.click());

      fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.classList.add('dragover');
      });

      fileUpload.addEventListener('dragleave', () => {
        fileUpload.classList.remove('dragover');
      });

      fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.classList.remove('dragover');

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
          this.handleFileUpload(files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          this.handleFileUpload(files[0]);
        }
      });
    }
  }

  private handleFileUpload(file: File): void {
    // Validate file
    if (!file.type.startsWith('image/')) {
      this.showToast('Please select an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      this.showToast('File size must be less than 5MB', 'error');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUpload = document.getElementById('file-upload');
      if (fileUpload && e.target?.result) {
        fileUpload.innerHTML = `
          <img src="${e.target.result}" alt="Event preview" style="max-width: 100%; max-height: 200px; border-radius: 0.5rem;">
          <p style="margin-top: 1rem; color: var(--success);">Image uploaded successfully</p>
        `;
      }
    };
    reader.readAsDataURL(file);

    this.showToast('Image uploaded successfully!', 'success');
  }

  private setupRouting(): void {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        this.navigateToPage(hash);
      }
    });
  }

  private updateDashboardData(): void {
    if (!this.currentUser) return;

    // Update user name in dashboard
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) {
      userNameEl.textContent = this.currentUser.name.split(' ')[0].toUpperCase();
    }

    // Update balance displays
    const balanceElements = [
      document.getElementById('account-balance'),
      document.getElementById('wallet-balance')
    ];

    balanceElements.forEach(el => {
      if (el) {
        el.textContent = this.currentUser!.balance.toFixed(2);
      }
    });

    // Update events count
    const eventCountElements = [
      document.getElementById('total-events'),
      document.getElementById('events-total')
    ];

    eventCountElements.forEach(el => {
      if (el) {
        el.textContent = this.events.length.toString();
      }
    });

    // Update settings form
    this.updateSettingsForm();

    // Update events display
    this.updateEventsDisplay();

    // Update withdrawals display
    this.updateWithdrawalsDisplay();
  }

  private updateSettingsForm(): void {
    if (!this.currentUser) return;

    const fields = [
      { id: 'settings-name', value: this.currentUser.name },
      { id: 'settings-email', value: this.currentUser.email },
      { id: 'settings-account-number', value: this.currentUser.accountNumber },
      { id: 'settings-bank', value: this.currentUser.bank },
      { id: 'settings-account-name', value: this.currentUser.accountName }
    ];

    fields.forEach(field => {
      const element = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement;
      if (element) {
        element.value = field.value;
      }
    });
  }

  private updateEventsDisplay(): void {
    // Update upcoming events on dashboard
    const upcomingEventsEl = document.getElementById('upcoming-events');
    if (upcomingEventsEl) {
      const upcomingEvents = this.events.filter(event => event.status === 'upcoming');

      if (upcomingEvents.length === 0) {
        upcomingEventsEl.innerHTML = '<div class="empty-state"><p>No upcoming events</p></div>';
      } else {
        upcomingEventsEl.innerHTML = upcomingEvents.map(event => `
          <div class="event-card">
            <h4>${event.name}</h4>
            <p>${event.date} at ${event.startTime}</p>
            <p>${event.location}</p>
          </div>
        `).join('');
      }
    }

    // Update events page
    const upcomingListEl = document.getElementById('upcoming-events-list');
    const allEventsListEl = document.getElementById('all-events-list');

    if (upcomingListEl) {
      const upcomingEvents = this.events.filter(event => event.status === 'upcoming');

      if (upcomingEvents.length === 0) {
        upcomingListEl.innerHTML = `
          <div class="empty-state">
            <p>No upcoming events</p>
            <button class="btn btn-primary" onclick="navigateTo('create-event')">Create New Event</button>
          </div>
        `;
      } else {
        upcomingListEl.innerHTML = upcomingEvents.map(event => this.renderEventCard(event)).join('');
      }
    }

    if (allEventsListEl) {
      if (this.events.length === 0) {
        allEventsListEl.innerHTML = `
          <div class="empty-state">
            <p>No events</p>
            <button class="btn btn-primary" onclick="navigateTo('create-event')">Create New Event</button>
          </div>
        `;
      } else {
        allEventsListEl.innerHTML = this.events.map(event => this.renderEventCard(event)).join('');
      }
    }
  }

  private renderEventCard(event: Event): string {
    return `
      <div class="event-card">
        <div class="event-header">
          <h4>${event.name}</h4>
          <span class="event-status status-${event.status}">${event.status}</span>
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-details">
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Time:</strong> ${event.startTime} - ${event.endTime}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>Category:</strong> ${event.category}</p>
        </div>
      </div>
    `;
  }

  private updateWithdrawalsDisplay(): void {
    const sections = [
      { id: 'pending-withdrawals', status: 'pending' },
      { id: 'approved-withdrawals', status: 'approved' },
      { id: 'rejected-withdrawals', status: 'rejected' }
    ];

    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const withdrawals = this.withdrawalRequests.filter(w => w.status === section.status);

        if (withdrawals.length === 0) {
          element.innerHTML = `<p class="empty-message">No ${section.status} withdrawals.</p>`;
        } else {
          element.innerHTML = withdrawals.map(withdrawal => `
            <div class="withdrawal-item">
              <div class="withdrawal-amount">₦${withdrawal.amount.toFixed(2)}</div>
              <div class="withdrawal-date">${new Date(withdrawal.date).toLocaleDateString()}</div>
              ${withdrawal.reason ? `<div class="withdrawal-reason">${withdrawal.reason}</div>` : ''}
            </div>
          `).join('');
        }
      }
    });
  }

  // Public methods for global access
  public navigateTo(page: string): void {
    this.navigateToPage(page);
  }

  public showModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    }
  }

  public closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    }
  }

  public logout(): void {
    localStorage.removeItem('popout_user');
    localStorage.removeItem('popout_events');
    localStorage.removeItem('popout_withdrawals');

    this.currentUser = null;
    this.events = [];
    this.withdrawalRequests = [];

    this.showToast('Logged out successfully', 'success');

    setTimeout(() => {
      this.showAuth();
      this.showAuthPage('login-page');
    }, 1000);
  }

  public verifyAccount(): void {
    if (!this.currentUser) return;

    const accountNumber = (document.getElementById('settings-account-number') as HTMLInputElement).value;
    const bank = (document.getElementById('settings-bank') as HTMLSelectElement).value;

    if (!accountNumber || !bank) {
      this.showToast('Please enter account number and select bank', 'error');
      return;
    }

    // Simulate account verification
    setTimeout(() => {
      const accountNameEl = document.getElementById('settings-account-name') as HTMLInputElement;
      if (accountNameEl) {
        accountNameEl.value = 'VICTOR OLUWATOMISIN MODUPE';
      }
      this.showToast('Account verified successfully!', 'success');
    }, 1500);
  }

  public showWithdrawModal(): void {
    this.showModal('withdraw-modal');
  }

  private showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}

// Global functions for HTML onclick handlers
declare global {
  interface Window {
    togglePassword: (inputId: string) => void;
    signInWithGoogle: () => void;
    navigateTo: (page: string) => void;
    showWithdrawModal: () => void;
    closeModal: (modalId: string) => void;
    logout: () => void;
    verifyAccount: () => void;
  }
}

// Initialize app
const app = new DashboardApp();

// Global functions
window.togglePassword = (inputId: string) => {
  const input = document.getElementById(inputId) as HTMLInputElement;
  const button = input?.nextElementSibling as HTMLButtonElement;

  if (input && button) {
    if (input.type === 'password') {
      input.type = 'text';
      button.querySelector('img')?.setAttribute('src', 'https://ext.same-assets.com/1940877551/3451761468.svg');
    } else {
      input.type = 'password';
      button.querySelector('img')?.setAttribute('src', 'https://ext.same-assets.com/1940877551/3451761468.svg');
    }
  }
};

window.signInWithGoogle = () => {
  // Simulate Google sign-in
  app['simulateLogin']('user@gmail.com', 'password');
};

window.navigateTo = (page: string) => {
  app.navigateTo(page);
};

window.showWithdrawModal = () => {
  app.showWithdrawModal();
};

window.closeModal = (modalId: string) => {
  app.closeModal(modalId);
};

window.logout = () => {
  app.logout();
};

window.verifyAccount = () => {
  app.verifyAccount();
};

// Add some CSS for event cards and withdrawal items
const additionalStyles = `
.event-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow-sm);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-header h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.event-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-upcoming {
  background: var(--purple-100);
  color: var(--primary-purple);
}

.status-completed {
  background: var(--gray-100);
  color: var(--gray-600);
}

.status-cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

.event-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.event-details p {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.withdrawal-item {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 0.5rem;
}

.withdrawal-amount {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.withdrawal-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.withdrawal-reason {
  font-size: 0.875rem;
  color: var(--error);
  margin-top: 0.5rem;
}

.file-upload-area.dragover {
  border-color: var(--primary-purple);
  background: var(--purple-50);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast-content p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}
`;

// Inject additional styles
const styleElement = document.createElement('style');
styleElement.textContent = additionalStyles;
document.head.appendChild(styleElement);
