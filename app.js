// DOM Elements
// At the top of your app.js file
const contactForm = document.getElementById('contact-form');
const loadingScreen = document.getElementById('loading-screen');
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

const whatsappBtn = document.getElementById('whatsapp-btn');

// Carousel elements  initializeButtons
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.dot');
const carouselContainer = document.querySelector('.carousel-container');

// Animation elements
const animatedElements = document.querySelectorAll('.amenity-card, .city-card, .gallery-item');

// State
let currentSlide = 0;
let carouselInterval;
let isCarouselPaused = false;
let currentPage = 'home';

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen after a delay
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        document.body.style.overflow = 'visible';
    }, 1500);

    // Initialize all components
    initializeNavigation();
    initializeCarousel();
    initializeScrollEffects();
    initializeAnimations();
    initializeContactForm();
    initializeMobileMenu();
    initializeButtons();
    
    // Set initial active states
    updateActiveNavLink('home');
    showPage('home');
}

// Navigation System
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            handleNavClick(this);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
}

function handleNavClick(link) {
    const page = link.getAttribute('data-page');
    const scrollTarget = link.getAttribute('data-scroll');

    if (page) {
        navigateToPage(page);
    } else if (scrollTarget && currentPage === 'home') {
        scrollToSection(scrollTarget);
    } else if (scrollTarget) {
        // If not on home page, go to home first then scroll
        navigateToPage('home');
        setTimeout(() => scrollToSection(scrollTarget), 300);
    }

    // Close mobile menu if open
    closeMobileMenu();
}

function navigateToPage(pageId) {
    currentPage = pageId;
    showPage(pageId);
    updateActiveNavLink(pageId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPage(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show target page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function updateActiveNavLink(pageId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = header ? header.offsetHeight : 70;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

function handlePopState(e) {
    const page = e.state?.page || 'home';
    navigateToPage(page);
}

// Button Interactions// Button Interactions
function initializeButtons() {
    // Select the main hero button specifically
    const heroCTAButton = document.querySelector('.hero-carousel .cta-button');
    if (heroCTAButton) {
        heroCTAButton.addEventListener('click', (e) => {
            e.preventDefault(); // Stop any default button action
            navigateToPage('contact');
        });
    }

    // Select the button in the contact preview section
    const contactPreviewButton = document.querySelector('.contact-preview .btn');
    if (contactPreviewButton) {
        contactPreviewButton.addEventListener('click', (e) => {
            e.preventDefault();
            // This button already has a data-page attribute, but this makes it explicit
            navigateToPage('contact');
        });
    }

    // Note: Your navigation links (Home, About, etc.) are already handled
    // correctly in the initializeNavigation() function, so we don't need to handle them here.
}

// Carousel Functionality
function initializeCarousel() {
    if (carouselSlides.length === 0) return;

    // Add pause on hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', pauseCarousel);
        carouselContainer.addEventListener('mouseleave', resumeCarousel);
    }

    // Dot navigation
    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left, go to next
            } else {
                prevSlide(); // Swipe right, go to previous
            }
        }
    }

    // Start auto-slide
    startCarousel();
}

// Add this entire function back into your app.js file

function initializeContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Initialize floating labels
        const formControls = contactForm.querySelectorAll('.form-control');
        formControls.forEach(control => {
            control.addEventListener('focus', handleInputFocus);
            control.addEventListener('blur', handleInputBlur);
            control.addEventListener('input', handleInputChange);
            
            // Check initial state
            if (control.value.trim()) {
                const label = control.nextElementSibling;
                if (label && label.classList.contains('floating-label')) {
                    animateLabel(label, true);
                }
            }
        });
    }
}

function startCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    
    carouselInterval = setInterval(() => {
        if (!isCarouselPaused) {
            nextSlide();
        }
    }, 4000);
}

function pauseCarousel() {
    isCarouselPaused = true;
}

function resumeCarousel() {
    isCarouselPaused = false;
}

function nextSlide() {
    if (carouselSlides.length > 0) {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        updateCarousel();
    }
}

function prevSlide() {
    if (carouselSlides.length > 0) {
        currentSlide = currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1;
        updateCarousel();
    }
}

function goToSlide(index) {
    if (index >= 0 && index < carouselSlides.length) {
        currentSlide = index;
        updateCarousel();
    }
}

function updateCarousel() {
    // Update slides
    carouselSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    // Update dots
    carouselDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    // Header blur effect on scroll
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeaderOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateHeaderOnScroll() {
    if (header) {
        const scrolled = window.scrollY > 50;
        header.classList.toggle('scrolled', scrolled);
    }
}

// Animations with Intersection Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation delay for cards
                if (entry.target.classList.contains('amenity-card')) {
                    const cards = document.querySelectorAll('.amenity-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
                
                if (entry.target.classList.contains('gallery-item')) {
                    const items = document.querySelectorAll('.gallery-item');
                    const index = Array.from(items).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });

    // Also observe sections for fade-in effects
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });
}

// Mobile Menu
function initializeMobileMenu() {
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navToggle && navMenu && 
            !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    if (navMenu && navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    }
}

function closeMobileMenu() {
    if (navMenu && navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    // Get form and button elements
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // --- Your existing validation is good, let's keep it ---
    const data = Object.fromEntries(formData);
    if (!data.name || !data.email || !data.subject || !data.message) {
        // Assuming you have a showNotification function
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // --- Your existing loading state is good, let's keep it ---
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // --- REPLACE the setTimeout with a real fetch call to Formspree ---
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            // SUCCESS: Formspree accepted the submission
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            
            // Reset floating labels after form reset
            const labels = form.querySelectorAll('.floating-label.active');
            labels.forEach(label => label.classList.remove('active'));

        } else {
            // ERROR: Formspree returned an error
            showNotification('Oops! There was a problem. Please try again.', 'error');
        }
    }).catch(error => {
        // NETWORK ERROR: Could not connect to Formspree
        showNotification('Network error. Please check your connection.', 'error');
    }).finally(() => {
        // ALWAYS RUNS: This will run after success or failure
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function handleInputFocus(e) {
    const input = e.target;
    const label = input.nextElementSibling;
    
    if (label && label.classList.contains('floating-label')) {
        animateLabel(label, true);
    }
}

function handleInputBlur(e) {
    const input = e.target;
    const label = input.nextElementSibling;
    
    if (label && label.classList.contains('floating-label') && !input.value.trim()) {
        animateLabel(label, false);
    }
}

function handleInputChange(e) {
    const input = e.target;
    const label = input.nextElementSibling;
    
    if (label && label.classList.contains('floating-label')) {
        if (input.value.trim()) {
            animateLabel(label, true);
        } else if (document.activeElement !== input) {
            animateLabel(label, false);
        }
    }
}

function animateLabel(label, active) {
    if (active) {
        label.style.top = '-8px';
        label.style.left = '8px';
        label.style.fontSize = '12px';
        label.style.color = 'var(--color-primary)';
        label.style.background = 'var(--color-surface)';
        label.style.padding = '0 4px';
        label.style.transform = 'none';
    } else {
        label.style.top = '';
        label.style.left = '';
        label.style.fontSize = '';
        label.style.color = '';
        label.style.background = '';
        label.style.padding = '';
        label.style.transform = '';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'});
        border-radius: var(--radius-lg);
        padding: var(--space-16);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        color: var(--color-text);
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// WhatsApp Button
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Open WhatsApp in new tab
        window.open('https://wa.me/919153164057', '_blank');
    });
    
    whatsappBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) translateY(-5px)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
}

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    // Arrow keys for carousel navigation
    if (currentPage === 'home') {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    }
});

// Page Visibility API for carousel
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        isCarouselPaused = true;
    } else {
        isCarouselPaused = false;
    }
});

// Initialize route based on URL hash
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'about', 'contact', 'policies'].includes(hash)) {
        navigateToPage(hash);
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(300px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(300px);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-12);
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: var(--transition-smooth);
    }
    
    .notification-close:hover {
        background: var(--color-secondary);
        color: var(--color-text);
    }
    
    .floating-label {
        transition: all 0.2s ease !important;
    }
`;
document.head.appendChild(style);

// Performance optimizations
// Preload images
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c431?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Start preloading after initial load
setTimeout(preloadImages, 2000);

// Error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

console.log('OJO trip website loaded successfully! 🏨✨');