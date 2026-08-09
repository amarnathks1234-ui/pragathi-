/**
 * Pragathi Career Guidance - Main JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initStatsCounter();
    initAchievementsSlider();
    initContactForm();
});

/* ==========================================
   1. Theme Toggle Management (Light/Dark)
   ========================================== */
function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    // Default to system preference if no theme saved, or light if not specified
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    });
}

/* ==========================================
   2. Mobile Navigation Menu Drawer
   ========================================== */
function initMobileNav() {
    const navLinks = document.getElementById('navlinks');
    const menuOpenBtn = document.querySelector('.fa-bars');
    const menuCloseBtn = document.querySelector('.fa-times');

    // Create menu overlay dynamically if not present
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    function openMenu() {
        if (navLinks) navLinks.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (navLinks) navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuOpenBtn) menuOpenBtn.addEventListener('click', openMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking navigation link
    if (navLinks) {
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => link.addEventListener('click', closeMenu));
    }
}

// Global window helpers for inline onclick legacy fallbacks
window.showmenu = function () {
    const navLinks = document.getElementById('navlinks');
    const navOverlay = document.querySelector('.nav-overlay');
    if (navLinks) navLinks.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

window.hidemenu = function () {
    const navLinks = document.getElementById('navlinks');
    const navOverlay = document.querySelector('.nav-overlay');
    if (navLinks) navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
};

/* ==========================================
   3. Animated Counter with Intersection Observer
   ========================================== */
function initStatsCounter() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observerOptions = {
        threshold: 0.4
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const duration = 2000; // 2 seconds animation
                const increment = target / (duration / 16); // 60fps

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = Math.ceil(count).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target.toLocaleString() + '+';
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

/* ==========================================
   4. Achievements Slider & Carousel
   ========================================== */
function initAchievementsSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const slides = slider.querySelector('.slides');
    const images = slider.querySelectorAll('.slides img');
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    const dotsContainer = slider.querySelector('.dots');
    const counterBadge = slider.querySelector('.slide-counter');

    if (!slides || !images.length) return;

    let currentIndex = 0;
    const totalSlides = images.length;
    let autoSlideTimer = null;

    // Create pagination dots
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function updateSlide() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update dots
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Update counter badge if exists
        if (counterBadge) {
            counterBadge.textContent = `${currentIndex + 1} / ${totalSlides}`;
        }
    }

    function goToSlide(index) {
        if (index >= totalSlides) currentIndex = 0;
        else if (index < 0) currentIndex = totalSlides - 1;
        else currentIndex = index;
        updateSlide();
        resetTimer();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto Slide Timer
    function startTimer() {
        autoSlideTimer = setInterval(nextSlide, 3500);
    }

    function resetTimer() {
        clearInterval(autoSlideTimer);
        startTimer();
    }

    // Touch Swipe Support
    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 40) {
            nextSlide();
        } else if (endX - startX > 40) {
            prevSlide();
        }
    }, { passive: true });

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    slider.addEventListener('mouseleave', startTimer);

    // Initial setup
    updateSlide();
    startTimer();
}

/* ==========================================
   5. Contact Form UX & Client Validation
   ========================================== */
function initContactForm() {

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const submitBtn = contactForm.querySelector("button");

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Sending...';
        const email = contactForm.email.value.trim();
        const phone = contactForm.phone.value.trim();

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (phone !== "" && !isValidPhone(phone)) {
            alert("Please enter a valid 10-digit Indian mobile number.");
            return;
        }
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function isValidPhone(phone) {
            return /^[6-9]\d{9}$/.test(phone);
        }

        emailjs.sendForm(
            "service_dark",
            "template_SAID",
            contactForm
        )
            .then(function () {

                alert("Message sent successfully!");

                contactForm.reset();

                submitBtn.disabled = false;

                submitBtn.innerHTML =
                    '<i class="fas fa-paper-plane"></i> Send Message';

            })
            .catch(function (error) {

                console.log("EmailJS Error:", error);

                alert(JSON.stringify(error));

            });

    });

}

document.addEventListener("DOMContentLoaded", initContactForm);

