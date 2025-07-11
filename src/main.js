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
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            smoothScrollTo(targetPosition, 800); // 800ms duration
        }
        // Close mobile menu after clicking a link
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    };

    // Easing function for smooth scroll
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    // Custom smooth scroll function
    const smoothScrollTo = (targetY, duration, easing = easeInOutQuad) => {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easing(timeElapsed, startY, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
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

    // Hide/show nav on scroll down/up
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
            // Scrolling down and past the header height
            header.classList.add('nav-hidden');
        } else {
            // Scrolling up
            header.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop;
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
        smoothScrollTo(0, 800); // Use custom smoothScrollTo with easing
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
            let delay = 0;

            projectCards.forEach(card => {
                const categories = card.dataset.category.split(' ');
                const shouldShow = filter === 'all' || categories.includes(filter);

                if (shouldShow) {
                    card.style.transitionDelay = `${delay}ms`;
                    card.classList.remove('hidden-card'); // Show the card
                    delay += 100; // Increment delay for the next card
                } else {
                    card.style.transitionDelay = '0ms';
                    card.classList.add('hidden-card'); // Hide the card
                }

                // Reset transition delay after animation
                card.addEventListener('transitionend', () => {
                    card.style.transitionDelay = '0ms';
                }, { once: true });
            });
        });
    });

    // Newsletter functionality
    const newsletterPopup = document.getElementById('newsletter-popup');
    const closeNewsletterBtn = document.querySelector('.close-newsletter');
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterConfirmation = document.getElementById('newsletter-confirmation');

    // Check localStorage for newsletter status on load
    if (newsletterPopup) {
        const newsletterClosed = localStorage.getItem('newsletterClosed');
        const newsletterSubscribed = localStorage.getItem('newsletterSubscribed');

        if (newsletterClosed === 'true' || newsletterSubscribed === 'true') {
            newsletterPopup.classList.add('hidden');
        }
    }

    // Close newsletter button functionality
    if (closeNewsletterBtn && newsletterPopup) {
        closeNewsletterBtn.addEventListener('click', () => {
            newsletterPopup.classList.add('hidden');
            localStorage.setItem('newsletterClosed', 'true');
        });
    }

    if (newsletterForm && newsletterConfirmation && newsletterPopup) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(newsletterForm);
            const email = formData.get('email');

            // Basic email validation
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address.');
                return; // Stop form submission
            }

            console.log('Newsletter subscribed with email:', email);

            // Simulate a backend call
            try {
                // Replace with your actual backend endpoint
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email }),
                });

                if (response.ok) {
                    newsletterForm.style.display = 'none'; // Hide the form
                    newsletterConfirmation.classList.add('show'); // Show confirmation with animation
                    newsletterPopup.classList.add('hidden'); // Hide the entire popup
                    localStorage.setItem('newsletterSubscribed', 'true'); // Set subscribed flag
                } else {
                    alert('Failed to subscribe. Please try again. (Placeholder)');
                }
            } catch (error) {
                console.error('Error subscribing:', error);
                alert('An error occurred. Please try again later. (Placeholder)');
            }
        });
    }

    // Testimonials carousel functionality
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonialGrid = testimonialCarousel ? testimonialCarousel.querySelector('.testimonial-grid') : null;
    const testimonialCards = testimonialGrid ? testimonialGrid.querySelectorAll('.testimonial-card') : [];
    const carouselDotsContainer = testimonialCarousel ? testimonialCarousel.querySelector('.carousel-dots') : null;

    if (testimonialCarousel && testimonialGrid && testimonialCards.length > 0 && carouselDotsContainer) {
        let currentIndex = 0;
        let intervalId;

        const createDots = () => {
            testimonialCards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('carousel-dot');
                if (index === 0) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => goToSlide(index));
                carouselDotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        const goToSlide = (index) => {
            testimonialCards.forEach(card => card.classList.remove('active-slide')); // Remove active class from all cards
            testimonialGrid.scrollLeft = testimonialCards[index].offsetLeft;
            currentIndex = index;
            updateDots();
            // Add active class to the new current card after a short delay to allow scroll to settle
            setTimeout(() => {
                testimonialCards[currentIndex].classList.add('active-slide');
            }, 50); // Short delay
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % testimonialCards.length;
            goToSlide(currentIndex);
        };

        const startCarousel = () => {
            intervalId = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        };

        const stopCarousel = () => {
            clearInterval(intervalId);
        };

        createDots();
        startCarousel();
        testimonialCards[currentIndex].classList.add('active-slide'); // Set initial active slide

        // Pause carousel on hover
        testimonialCarousel.addEventListener('mouseenter', stopCarousel);
        testimonialCarousel.addEventListener('mouseleave', startCarousel);
    }

    // Blog filter functionality
    const blogFilterButtons = document.querySelectorAll('.blog-filters .filter-button');
    const blogCards = document.querySelectorAll('.blog-grid .blog-card');

    blogFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            blogFilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filter = button.dataset.filter;

            blogCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block'; // Show the card
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    });

    // Blog pagination functionality
    const blogPaginationCards = document.querySelectorAll('.blog-grid .blog-card');
    const paginationContainer = document.querySelector('.blog-pagination');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbersContainer = document.querySelector('.page-numbers');

    const postsPerPage = 3; // Number of blog posts per page
    let currentPage = 1;

    const displayBlogPage = (page) => {
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;

        blogPaginationCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Update active page number button
        const pageNumberButtons = pageNumbersContainer.querySelectorAll('.page-number');
        pageNumberButtons.forEach(button => {
            if (parseInt(button.dataset.page) === page) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // Enable/disable prev/next buttons
        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = page === Math.ceil(blogPaginationCards.length / postsPerPage);
    };

    const setupBlogPagination = () => {
        const totalPages = Math.ceil(blogPaginationCards.length / postsPerPage);
        pageNumbersContainer.innerHTML = ''; // Clear existing page numbers

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.classList.add('pagination-button', 'page-number');
            button.dataset.page = i;
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                displayBlogPage(currentPage);
            });
            pageNumbersContainer.appendChild(button);
        }

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayBlogPage(currentPage);
            }
        });

        nextPageBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayBlogPage(currentPage);
            }
        });

        displayBlogPage(currentPage); // Display initial page
    };

    // Call setupBlogPagination after content is loaded
    // This needs to be called after loadContent('pages/home.html');
    // For now, I'll add it directly here, assuming blog cards are present on initial load.
    setupBlogPagination();

    // Nav section highlight on scroll
    const navLinksForScroll = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section'); // Assuming your sections have a <section> tag

    const activateNavLink = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) { // 60px offset for header height
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksForScroll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', activateNavLink);
});