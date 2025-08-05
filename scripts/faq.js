document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const button = item.querySelector('.faq-question');
    
    if (button) {
      button.addEventListener('click', () => {
        // Close others
        faqItems.forEach(i => {
          if (i !== item) i.classList.remove('active');
        });

        // Toggle current
        item.classList.toggle('active');
      });

      // Optional: Trigger entry animation with delay
      setTimeout(() => item.classList.add('animate-in'), 100 * index);
    }
  });
});