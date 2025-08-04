# Event Ticketing Dashboard - HTML Version

A comprehensive event ticketing management dashboard built with vanilla HTML, CSS, and JavaScript.

## Features

### 🔐 Authentication
- Bank verification login system
- Support for major Nigerian banks
- Account number validation (10 digits)
- User session management with localStorage

### 📊 Dashboard
- Responsive sidebar navigation
- Overview of upcoming events
- Event management and creation
- Wallet and transaction tracking
- User settings and profile management

### 🎫 Event Management
- Create new events with detailed information
- View upcoming events with sales statistics
- Progress tracking for ticket sales
- Event categorization (Music, Comedy, Sports, etc.)

### 💳 Wallet Features
- Balance overview with gradient design
- Transaction history with filtering
- Linked bank account display
- Withdrawal and funding options

### ⚙️ Settings
- Profile management
- Banking information updates
- Notification preferences
- Security settings

## File Structure

```
html-version/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All stylesheets
├── js/
│   └── app.js          # JavaScript functionality
└── README.md           # This file
```

## Design System

### Color Palette
- **Primary**: #FF2D95 (Pink)
- **Primary Light**: #FF8BC2
- **Primary Dark**: #E0267E
- **Background**: #FFFFFF
- **Text**: #1A1A1A
- **Muted**: #6B7280

### Features
- CSS custom properties for consistent theming
- Responsive design for mobile and desktop
- Smooth transitions and hover effects
- Modern gradient backgrounds
- Clean card-based layouts

## Setup Instructions

1. **Download the files**: Save all files in a folder called `html-version`

2. **Open in browser**: Open `index.html` in any modern web browser

3. **Login**: Use the following test credentials:
   - Full Name: Any name
   - Account Number: Any 10-digit number
   - Bank: Select any bank from the dropdown

4. **Explore**: Navigate through the dashboard using the sidebar

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Local Storage

The app uses localStorage to persist:
- User authentication data
- Created events
- User preferences
- Session information

## Responsive Design

- **Desktop**: Full sidebar with expanded navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Hidden sidebar with hamburger menu

## Customization

### Colors
Edit the CSS custom properties in `styles.css`:

```css
:root {
    --primary: #FF2D95;
    --primary-light: #FF8BC2;
    /* Add your custom colors */
}
```

### Content
- Modify event data in the HTML
- Update bank list in JavaScript
- Add new navigation items

### Functionality
- Extend the JavaScript for real API integration
- Add more form validation
- Implement additional features

## Notes

- This is a frontend-only demonstration
- No real bank verification is performed
- Data is stored locally (not persistent across browsers)
- Ready for backend integration when needed

## Next Steps

To make this production-ready:
1. Integrate with real banking APIs
2. Add server-side authentication
3. Implement real database storage
4. Add payment processing
5. Include email notifications
6. Add data export features