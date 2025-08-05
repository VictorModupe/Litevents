class HeaderComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background-color: #0f172a;
          color: white;
          font-family: 'Poppins', sans-serif;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        nav a {
          margin-left: 1rem;
          color: white;
          text-decoration: none;
          font-weight: 500;
        }
        nav a:hover {
          text-decoration: underline;
        }
      </style>

      <header>
        <div class="logo">Popout Tickets</div>
        <nav>
          <a href="index.html">Home</a>
          <a href="events.html">Events</a>
          <a href="pricing.html">Pricing</a>
          <a href="faq.html">FAQ</a>
        </nav>
      </header>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
