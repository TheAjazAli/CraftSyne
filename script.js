document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const header = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"], .mobile-nav a[href^="#"]');
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const closeBtn = document.querySelector('.close-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const backToTopBtn = document.querySelector('.back-to-top');
    const sections = document.querySelectorAll('section[id]'); // Sections with IDs for highlighting
    const scrollIndicator = document.querySelector('.scroll-indicator'); // Arrow down button
    const portfolioFilters = document.querySelectorAll('.filter-btn'); // Portfolio filter buttons
    const portfolioItems = document.querySelectorAll('.project-card'); // Portfolio items
    const testimonialSlides = document.querySelectorAll('.testimonial-slide'); // Testimonial slides
    const prevBtn = document.querySelector('.prev-btn'); // Testimonial previous button
    const nextBtn = document.querySelector('.next-btn'); // Testimonial next button
    const faqItems = document.querySelectorAll('.faq-item'); // FAQ items
    const dots = document.querySelectorAll('.dot');

    // --- Helper Function: Get Header Height ---
    const getHeaderHeight = () => {
        return header ? header.offsetHeight : 0;
    };

    // --- 1. Header Shrinking on Scroll ---
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // --- 2. Mobile Navigation Toggle ---
    const toggleMobileNav = () => {
        mobileNavOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll', mobileNavOverlay.classList.contains('active'));
    };

    if (hamburgerBtn && closeBtn && mobileNavOverlay) {
        hamburgerBtn.addEventListener('click', toggleMobileNav);
        closeBtn.addEventListener('click', toggleMobileNav);

        // Close mobile menu when a link is clicked inside it
        mobileNavOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNavOverlay.classList.contains('active')) {
                    toggleMobileNav();
                }
            });
        });
    } else {
        console.error("Mobile navigation elements not found.");
    }

    // --- 3. Smooth Scrolling ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = getHeaderHeight();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Smooth scroll target not found for id: ${targetId}`);
            }
        });
    });

    // --- 4. Active Link Highlighting (using Intersection Observer) ---
    const desktopNavLinks = document.querySelectorAll('.main-nav a[href^="#"]');

    const observerOptions = {
        root: null,
        rootMargin: `-${getHeaderHeight()}px 0px -40% 0px`,
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingLink = document.querySelector(`.main-nav a[href="#${id}"], .mobile-nav a[href="#${id}"]`);

            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                    const desktopLink = document.querySelector(`.main-nav a[href="#${id}"]`);
                    if (desktopLink) desktopLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (sections.length > 0) {
        sections.forEach(section => {
            observer.observe(section);
        });
    } else {
        console.warn("No sections found for active link highlighting.");
    }

    // --- 5. Back-to-Top Button ---
    const handleBackToTopScroll = () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.warn("Back-to-top button not found.");
    }

    // --- 6. Arrow Down Button ---
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const heroSection = document.querySelector('#hero');
            const aboutSection = document.querySelector('#about');
            if (heroSection && aboutSection) {
                const heroHeight = heroSection.offsetHeight;
                const heroOffset = heroSection.offsetTop;
                const aboutOffset = aboutSection.offsetTop;
                const scrollPosition = heroOffset + heroHeight - getHeaderHeight();

                window.scrollTo({
                    top: aboutOffset - getHeaderHeight(),
                    behavior: 'smooth'
                });
            } else {
                console.warn("Hero or About section not found.");
            }
        });
    } else {
        console.warn("Scroll indicator not found.");
    }

    // --- 7. Portfolio Filtering ---
    if (portfolioFilters.length && portfolioItems.length) {
        let currentFilter = 'all';

        portfolioFilters.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                currentFilter = filter;
                filterPortfolioItems();

                portfolioFilters.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        function filterPortfolioItems() {
            portfolioItems.forEach(item => {
                if (currentFilter === 'all' || item.classList.contains(currentFilter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    } else {
        console.warn("Portfolio filters or items not found.");
    }

    // --- 8. Testimonial Carousel ---
    let currentSlide = 0;

    function showSlide(index) {
        testimonialSlides.forEach(slide => slide.style.display = 'none');
        testimonialSlides[index].style.display = 'block';

        // Update dots
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
        showSlide(currentSlide);
    }

    if (prevBtn && nextBtn && testimonialSlides.length) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        showSlide(currentSlide); // Ensure the first slide is shown on page load
    } else {
        console.warn("Testimonial carousel elements not found.");
    }

    // --- 9. FAQ Toggle ---
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // --- Attach Scroll Event Listeners ---
    window.addEventListener('scroll', () => {
        if (header) handleHeaderScroll();
        if (backToTopBtn) handleBackToTopScroll();
    });

    // Initial checks on page load
    if (header) handleHeaderScroll();
    if (backToTopBtn) handleBackToTopScroll();
});