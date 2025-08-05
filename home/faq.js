document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      // Close others
      faqItems.forEach(i => {
        if (i !== item) i.classList.remove('active');
      });

      // Toggle current
      item.classList.toggle('active');
    });

    // Optional: Trigger entry animation
    setTimeout(() => item.classList.add('animate-in'), 100);
  });
});
