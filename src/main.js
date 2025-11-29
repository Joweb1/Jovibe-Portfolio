document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Function to initialize scroll reveal animations
    const initializeScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');

        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of element visible to trigger
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    };

    // Function to load content
    const loadContent = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            app.innerHTML = content;
            // Re-apply smooth scrolling after content is loaded
            applySmoothScrolling();
            // Initialize scroll reveal animations after content is loaded
            initializeScrollReveal();
        } catch (error) {
            console.error('Error loading content:', error);
            app.innerHTML = '<p>Error loading page.</p>';
        }
    };

    // Initial load of home.html
    loadContent('pages/home.html');

    // Smooth scrolling for anchor links
    const applySmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.removeEventListener('click', handleSmoothScroll); // Remove existing to prevent duplicates
            anchor.addEventListener('click', handleSmoothScroll);
        });
    };

    const handleSmoothScroll = function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
        // Close mobile menu after clicking a link
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    };

    // Toggle mobile menu
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    applySmoothScrolling(); // Apply initially

    // Add header shadow on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Contact form submission placeholder
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formProps = Object.fromEntries(formData);

            console.log('Form submitted:', formProps);

            // Simulate a backend call
            try {
                // Replace with your actual backend endpoint
                const response = await fetch('/api/contact', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formProps),
                });

                if (response.ok) {
                    alert('Message sent successfully! (Placeholder)');
                    contactForm.reset();
                } else {
                    alert('Failed to send message. Please try again. (Placeholder)');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred. Please try again later. (Placeholder)');
            }
        });
    }

    // Dynamically update footer copyright year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const enableLightTheme = () => {
        body.classList.add('light-theme');
        themeToggleBtn.querySelector('.material-icons').textContent = 'dark_mode';
        localStorage.setItem('theme', 'light');
    };

    const enableDarkTheme = () => {
        body.classList.remove('light-theme');
        themeToggleBtn.querySelector('.material-icons').textContent = 'light_mode';
        localStorage.setItem('theme', 'dark');
    };

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        enableLightTheme();
    } else {
        enableDarkTheme(); // Default to dark theme if no preference or 'dark'
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('light-theme')) {
                enableDarkTheme();
            } else {
                enableLightTheme();
            }
        });
    }

    // Hide loading spinner once content is loaded
    const loadingSpinner = document.getElementById('loading-spinner');
    if (loadingSpinner) {
        window.onload = () => {
            loadingSpinner.classList.add('hidden');
        };
    }

    // Scroll progress indicator
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });

    // Portfolio filter functionality
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.portfolio-grid .project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filter = button.dataset.filter;

            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden-card'); // Show the card
                } else {
                    card.classList.add('hidden-card'); // Hide the card
                }
            });
        });
    });
});