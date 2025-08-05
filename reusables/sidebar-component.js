class SidebarComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        
/* Sidebar */

.sidebar {
          font-family: 'Poppins', sans-serif;
          width: 17rem;
          background: white;
          border-right: 1px solid var(--border-color, #e5e7eb);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
          z-index: 1000;
          transform: translateX(0);
          transition: transform 0.3s ease-in-out;
        }

        .sidebar.hidden {
          transform: translateX(-100%);
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color, #e5e7eb);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary, #111827);
        }

        .sidebar-toggle {
          background: none;
          border: none;
          cursor: pointer;
          flex-direction: column;
          gap: 3px;
          padding: 0.5rem;
          display: flex;
        }

        .sidebar-toggle span {
          width: 20px;
          height: 2px;
          background: var(--text-primary, #111827);
          transition: 0.3s;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          color: var(--text-secondary, #6b7280);
          text-decoration: none;
          transition: 0.3s;
          border-left: 3px solid transparent;
        }

        .nav-item:hover {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .nav-item.active {
          background: #f3e8ff;
          color: #7c3aed;
          border-left-color: #7c3aed;
          font-weight: 500;
        }

        .sidebar-footer {
          border-top: 1px solid var(--border-color, #e5e7eb);
          padding: 1rem 0;
        }

        .nav-item.logout {
          color: #ef4444;
        }

        .nav-item.logout:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .sidebar-overlay.active {
          display: block;
        }

        @media (min-width: 768px) {
          .sidebar-toggle {
            display: none;
          }

          .sidebar-overlay {
            display: none !important;
          }
        }


      </style>
            <div class="sidebar-overlay" id="sidebar-overlay"></div>


          <!-- Sidebar -->
    <aside id="sidebar" class="sidebar hidden">
      <div class="sidebar-header">
        <a class="nav" href="/home/">
                    <img src="/logo.jpg" alt="Logo" style="width:60px;">
                    </a>
        <button id="sidebar-toggle" class="sidebar-toggle">
          <span></span><span></span><span></span>
        </button>
      </div>
      

      <nav class="sidebar-nav">
        <a href="/dashboard/" class="nav-item {% if active_page == 'dashboard' %}active{% endif %}" data-page="dashboard">
          Dashboard
        </a>
        <a href="/events/" class="nav-item {% if active_page == 'events' %}active{% endif %}" data-page="events">Events</a>
        <a href="/wallet/" class="nav-item {% if active_page == 'wallet' %}active{% endif %}" data-page="wallet">Wallet</a>
        <a href="/settings/" class="nav-item {% if active_page == 'settings' %}active{% endif %}" data-page="settings">Settings</a>
      </nav>

      <div class="sidebar-footer">
        <a href="https://wa.me/{{ support_number }}" class="nav-item">Contact</a>
        <a href="/logout/" class="nav-item logout" onclick="logout()">Logout</a>
      </div>
    </aside>
    `;
     this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  connectedCallback() {
    const toggleBtn = this.shadowRoot.getElementById('sidebar-toggle');
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const overlay = this.shadowRoot.getElementById('sidebar-overlay');

    toggleBtn.addEventListener('click', this.toggleSidebar);
    overlay.addEventListener('click', this.toggleSidebar);
  }

  toggleSidebar() {
    const sidebar = this.shadowRoot.getElementById('sidebar');
    const overlay = this.shadowRoot.getElementById('sidebar-overlay');

    sidebar.classList.toggle('hidden');
    overlay.classList.toggle('active');
  }
}

customElements.define('sidebar-component', SidebarComponent);
