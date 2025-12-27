    // Function to initialize all dynamic components
    const initComponents = () => {
        // Testimonials carousel functionality
        const testimonialCarousel = document.querySelector('.testimonial-carousel');
        if (testimonialCarousel) {
            const testimonialCards = testimonialCarousel.querySelectorAll('.testimonial-card');
            const carouselDotsContainer = document.querySelector('.carousel-dots');
            const prevArrow = document.querySelector('.prev-arrow');
            const nextArrow = document.querySelector('.next-arrow');

            if (testimonialCards.length > 0) {
                let currentIndex = 0;
                let intervalId;

                const createDots = () => {
                    if (carouselDotsContainer) {
                        carouselDotsContainer.innerHTML = '';
                        testimonialCards.forEach((_, index) => {
                            const dot = document.createElement('span');
                            dot.classList.add('carousel-dot');
                            if (index === 0) {
                                dot.classList.add('active');
                            }
                            dot.addEventListener('click', () => goToSlide(index));
                            carouselDotsContainer.appendChild(dot);
                        });
                    }
                };

                const updateDots = () => {
                    if (carouselDotsContainer) {
                        const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
                        dots.forEach((dot, index) => {
                            dot.classList.toggle('active', index === currentIndex);
                        });
                    }
                };

                const goToSlide = (index) => {
                    const card = testimonialCards[index];
                    if (card) {
                        testimonialCarousel.scrollTo({
                            left: card.offsetLeft,
                            behavior: 'smooth'
                        });
                        currentIndex = index;
                        updateDots();
                    }
                };

                const nextSlide = () => {
                    currentIndex = (currentIndex + 1) % testimonialCards.length;
                    goToSlide(currentIndex);
                };

                const prevSlide = () => {
                    currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
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

                testimonialCarousel.addEventListener('mouseenter', stopCarousel);
                testimonialCarousel.addEventListener('mouseleave', startCarousel);

                if (prevArrow && nextArrow) {
                    prevArrow.addEventListener('click', prevSlide);
                    nextArrow.addEventListener('click', nextSlide);
                }

                let touchStartX = 0;
                let touchEndX = 0;

                testimonialCarousel.addEventListener('touchstart', (e) => {
                    touchStartX = e.touches[0].clientX;
                    stopCarousel();
                });

                testimonialCarousel.addEventListener('touchmove', (e) => {
                    touchEndX = e.touches[0].clientX;
                });

                testimonialCarousel.addEventListener('touchend', () => {
                    if (touchStartX - touchEndX > 50) {
                        nextSlide();
                    } else if (touchEndX - touchStartX > 50) {
                        prevSlide();
                    }
                    startCarousel();
                });
            }
        }

        // Blog pagination functionality
        const blogPaginationCards = document.querySelectorAll('.blog-grid .blog-card');
        const paginationContainer = document.querySelector('.blog-pagination');
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');
        const pageNumbersContainer = document.querySelector('.page-numbers');

        if (blogPaginationCards.length > 0 && paginationContainer) {
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
                if (pageNumbersContainer) {
                    const pageNumberButtons = pageNumbersContainer.querySelectorAll('.page-number');
                    pageNumberButtons.forEach(button => {
                        if (parseInt(button.dataset.page) === page) {
                            button.classList.add('active');
                        } else {
                            button.classList.remove('active');
                        }
                    });
                }

                // Enable/disable prev/next buttons
                if (prevPageBtn) {
                    prevPageBtn.disabled = page === 1;
                }
                if (nextPageBtn) {
                    nextPageBtn.disabled = page === Math.ceil(blogPaginationCards.length / postsPerPage);
                }
            };

            const setupBlogPagination = () => {
                const totalPages = Math.ceil(blogPaginationCards.length / postsPerPage);
                if (pageNumbersContainer) {
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
                }

                if (prevPageBtn) {
                    prevPageBtn.addEventListener('click', () => {
                        if (currentPage > 1) {
                            currentPage--;
                            displayBlogPage(currentPage);
                        }
                    });
                }

                if (nextPageBtn) {
                    nextPageBtn.addEventListener('click', () => {
                        if (currentPage < totalPages) {
                            currentPage++;
                            displayBlogPage(currentPage);
                        }
                    });
                }

                displayBlogPage(currentPage); // Display initial page
            };
            setupBlogPagination();
        }
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
            // Initialize all components after content is loaded
            requestAnimationFrame(initComponents);
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
    const smoothScrollTo = (targetY, initialDuration = 800, easing = easeInOutQuad) => {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        let startTime = null;

        // Calculate dynamic duration based on distance
        const pixelsPerSecond = 1000; // Adjust this value to control scroll speed
        const minDuration = 300; // Minimum duration in ms
        const maxDuration = 1200; // Maximum duration in ms
        const dynamicDuration = Math.min(maxDuration, Math.max(minDuration, Math.abs(distance) / (pixelsPerSecond / 1000))); // Convert pixelsPerSecond to ms

        const duration = dynamicDuration; // Use the dynamically calculated duration

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easing(timeElapsed, startY, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        requestAnimationFrame(animation);
    };

    // Custom smooth scroll function for horizontal scrolling
    const smoothScrollLeftTo = (element, targetX, duration, easing = easeInOutQuad) => {
        const startX = element.scrollLeft;
        const distance = targetX - startX;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easing(timeElapsed, startX, distance, duration);
            element.scrollLeft = run;
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
    const contactSuccessMessage = document.getElementById('contact-success-message');
    const contactErrorMessage = document.getElementById('contact-error-message');

    // Function to show a message
    const showMessage = (messageElement) => {
        messageElement.classList.add('show');
        // Automatically hide after 5 seconds
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 5000);
    };

    if (contactForm && contactSuccessMessage && contactErrorMessage) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formProps = Object.fromEntries(formData);

            // Hide any previously shown messages
            contactSuccessMessage.classList.remove('show');
            contactErrorMessage.classList.remove('show');

            console.log('Form submitted:', formProps);

            // Basic email validation (example, more robust validation needed)
            const emailInput = contactForm.querySelector('input[type="email"]');
            if (!emailInput || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                contactErrorMessage.textContent = 'Please enter a valid email address.';
                showMessage(contactErrorMessage);
                return; // Stop form submission
            }


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
                    contactSuccessMessage.textContent = 'Message sent successfully!';
                    showMessage(contactSuccessMessage);
                    contactForm.reset();
                } else {
                    contactErrorMessage.textContent = 'Failed to send message. Please try again.';
                    showMessage(contactErrorMessage);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                contactErrorMessage.textContent = 'An error occurred. Please try again later.';
                showMessage(contactErrorMessage);
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

                    // Fade out the confirmation message after a delay
                    setTimeout(() => {
                        newsletterConfirmation.classList.remove('show');
                    }, 2500); // Start fading out after 2.5 seconds

                    // Hide the entire popup after a delay
                    setTimeout(() => {
                        newsletterPopup.classList.add('hidden');
                    }, 3000); // Hide after 3 seconds
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

    // Parallax effect for hero background and text
    const heroSection = document.getElementById('hero');
    const heroH1 = document.querySelector('#hero h1');
    const heroP = document.querySelector('#hero p');
    const heroCtaContainer = document.querySelector('#hero .tooltip-container');

    if (heroSection && heroH1 && heroP && heroCtaContainer) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            // Adjust the multiplier for a more or less subtle effect
            heroSection.style.backgroundPositionY = -scrollPosition * 0.3 + 'px';

            // Apply parallax to hero text elements
            heroH1.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            heroP.style.transform = `translateY(${scrollPosition * 0.15}px)`;
            heroCtaContainer.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        });
    }
});