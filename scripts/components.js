// Component loader for modular HTML
document.addEventListener('DOMContentLoaded', function() {
    const components = [
        { id: 'header-component', file: 'components/header.html' },
        { id: 'hero-component', file: 'components/hero.html' },
        { id: 'gallery-component', file: 'components/gallery.html' },
        { id: 'events-component', file: 'components/events.html' },
        { id: 'pricing-component', file: 'components/pricing.html' },
        { id: 'faq-component', file: 'components/faq.html' },
        { id: 'features-component', file: 'components/features.html' },
        { id: 'footer-component', file: 'components/footer.html' }
    ];

    components.forEach(component => {
        const element = document.getElementById(component.id);
        if (element) {
            fetch(component.file)
                .then(response => response.text())
                .then(html => {
                    element.innerHTML = html;
                })
                .catch(error => {
                    console.error(`Error loading ${component.file}:`, error);
                });
        }
    });
});