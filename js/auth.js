// Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('popout_current_user'));
        this.init();
    }

    init() {
        this.updateUI();
        this.bindEvents();
    }

    bindEvents() {
        // Login/Signup buttons
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showAuthModal('login');
        });

        document.getElementById('signup-btn').addEventListener('click', () => {
            this.showAuthModal('signup');
        });

        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Auth form submissions
        document.getElementById('login-form-element').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        document.getElementById('signup-form-element').addEventListener('submit', (e) => {
            this.handleSignup(e);
        });

        // Switch between login and signup
        document.getElementById('show-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('signup');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchAuthForm('login');
        });
    }

    showAuthModal(type = 'login') {
        const modal = document.getElementById('auth-modal');
        modal.classList.add('active');
        this.switchAuthForm(type);
    }

    switchAuthForm(type) {
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (type === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Simple validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            currentUser = user;
            localStorage.setItem('popout_current_user', JSON.stringify(user));
            
            this.updateUI();
            this.closeAuthModal();
            showToast(`Welcome back, ${user.name}!`, 'success');
        } else {
            showToast('Invalid email or password', 'error');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // Simple validation
        if (!name || !email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            showToast('User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            joinDate: new Date().toISOString()
        };

        users.push(newUser);
        this.currentUser = newUser;
        currentUser = newUser;
        
        localStorage.setItem('popout_current_user', JSON.stringify(newUser));
        saveData();

        this.updateUI();
        this.closeAuthModal();
        showToast(`Welcome to PopOut Tickets, ${name}!`, 'success');
    }

    logout() {
        this.currentUser = null;
        currentUser = null;
        localStorage.removeItem('popout_current_user');
        this.updateUI();
        showToast('Logged out successfully', 'success');
        
        // Redirect to home if on protected page
        const currentPage = document.querySelector('.page.active').id;
        if (currentPage === 'create-event-page' || currentPage === 'my-tickets-page') {
            showPage('home');
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const userMenu = document.getElementById('user-menu');
        const userName = document.getElementById('user-name');

        if (this.currentUser) {
            loginBtn.classList.add('hidden');
            signupBtn.classList.add('hidden');
            userMenu.classList.remove('hidden');
            userName.textContent = this.currentUser.name;
        } else {
            loginBtn.classList.remove('hidden');
            signupBtn.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.remove('active');
        
        // Reset forms
        document.getElementById('login-form-element').reset();
        document.getElementById('signup-form-element').reset();
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    requireAuth(callback) {
        if (this.isLoggedIn()) {
            callback();
        } else {
            showToast('Please login to continue', 'warning');
            this.showAuthModal('login');
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();