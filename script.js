document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Page Loader --- */
    const pageLoader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('fade-out');
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 500);
        }, 500); // Small delay for effect
    });

    /* --- 2. Navbar & Mobile Menu --- */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const backToTop = document.getElementById('backToTop');

    // Sticky Navbar & Back to Top
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.pointerEvents = 'all';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.pointerEvents = 'none';
        }

        updateActiveNavLink();
    });

    // Mobile Menu Toggle
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        const icon = mobileToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('ph-list', 'ph-x');
        } else {
            icon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Close mobile menu on link click or overlay click
    function closeMenu() {
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileToggle.querySelector('i').classList.replace('ph-x', 'ph-list');
    }

    document.querySelectorAll('.nav-link, .nav-book-btn').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking the dark overlay
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('menu-open') &&
            !navLinks.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Active Nav Link Update on Scroll
    const sections = document.querySelectorAll('section');
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    /* --- 3. Search Overlay --- */
    const searchBtn = document.getElementById('searchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchOverlay = document.getElementById('searchOverlay');

    searchBtn.addEventListener('click', () => searchOverlay.classList.add('active'));
    closeSearchBtn.addEventListener('click', () => searchOverlay.classList.remove('active'));

    /* --- 4. Intersection Observer (Scroll Animations & Counters) --- */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a counter, animate it
                if (entry.target.classList.contains('counter') || entry.target.classList.contains('years')) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target); // Only animate once
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .counter, .years').forEach(el => {
        observer.observe(el);
    });

    function animateCounter(el) {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const stepTime = Math.abs(Math.floor(duration / target)) || 10;
        let current = 0;

        const timer = setInterval(() => {
            const increment = target > 1000 ? Math.ceil(target / 100) : 1;
            current += increment;

            if (current >= target) {
                el.innerText = target + (target > 1000 ? '+' : '');
                clearInterval(timer);
            } else {
                el.innerText = current;
            }
        }, stepTime);
    }

    /* --- 5. Menu Filtering --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            menuItems.forEach(item => {
                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; /* trigger reflow */

                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'flex';
                    item.style.animation = 'fadeUpAnim 0.5s forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    /* --- 6. Special Offer Countdown --- */
    function startCountdown() {
        // Set to 4 hours from now for demo
        let targetDate = new Date().getTime() + (4 * 60 * 60 * 1000) + (32 * 60 * 1000) + (45 * 1000);

        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!hoursEl) return;

        setInterval(() => {
            let now = new Date().getTime();
            let distance = targetDate - now;

            if (distance < 0) {
                targetDate = new Date().getTime() + (4 * 60 * 60 * 1000); // reset
                return;
            }

            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            hoursEl.innerText = hours < 10 ? '0' + hours : hours;
            minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
            secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
        }, 1000);
    }
    startCountdown();

    /* --- 7. Gallery Lightbox --- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightbox = document.getElementById('closeLightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').getAttribute('src');
            lightboxImg.setAttribute('src', imgSrc);
            lightbox.classList.add('active');
        });
    });

    closeLightbox.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    /* --- 8. Testimonial Slider --- */
    const slides = document.querySelectorAll('.slide');
    const sliderDotsContainer = document.getElementById('sliderDots');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length > 0) {
        // Create Dots
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(idx));
            sliderDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }

        if (nextSlideBtn && prevSlideBtn) {
            nextSlideBtn.addEventListener('click', () => {
                nextSlide();
                resetInterval();
            });
            prevSlideBtn.addEventListener('click', () => {
                prevSlide();
                resetInterval();
            });
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }
        resetInterval();
    }

    /* --- 9. Shopping Cart Logic (Local Storage) --- */
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

    // Open/Close Cart
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('active');
        cartDrawer.classList.add('active');
    });
    const closeCart = () => {
        cartOverlay.classList.remove('active');
        cartDrawer.classList.remove('active');
    };
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Update Cart UI
    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
            checkoutBtn.disabled = true;
        } else {
            checkoutBtn.disabled = false;
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;

                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeItem(${index})"><i class="ph ph-trash"></i></button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }

        cartCount.innerText = count;
        cartTotalAmount.innerText = `₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        localStorage.setItem('aura_cart', JSON.stringify(cart));
    }

    // Add to Cart Logic
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const img = btn.getAttribute('data-img');

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            updateCartUI();
            showToast('Added to Cart', 'success');

            // Add small bump animation to cart icon
            cartCount.style.transform = 'scale(1.5)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Expose functions to global scope for inline onclick usage
    window.updateQty = function (index, change) {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else {
            cart.splice(index, 1);
        }
        updateCartUI();
    };

    window.removeItem = function (index) {
        cart.splice(index, 1);
        updateCartUI();
        showToast('Item removed', 'success');
    };

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            showToast('Order Placed Successfully!', 'success');
            cart = [];
            updateCartUI();
            closeCart();
        }
    });

    updateCartUI(); // Initial call

    /* --- 10. Form Validation & Toasts --- */
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Basic validation
            let isValid = true;
            resForm.querySelectorAll('input[required]').forEach(input => {
                if (!input.value) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = 'var(--glass-border)';
                }
            });
            
            const email = document.getElementById('resEmail');
            if (email && email.value && !email.value.includes('@')) {
                email.style.borderColor = 'red';
                isValid = false;
            }

            if (isValid) {
                const btn = document.getElementById('resSubmitBtn');
                const originalText = btn.innerText;
                btn.innerHTML = '<i class="ph-fill ph-check-circle"></i> Confirmed';
                btn.style.background = '#4CAF50';
                btn.style.borderColor = '#4CAF50';
                btn.style.color = 'white';
                btn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    showToast('Reservation Confirmed! We will email you the details.', 'success');
                    resForm.reset();
                    btn.innerText = originalText;
                    btn.style.background = 'var(--color-gold)';
                    btn.style.borderColor = 'var(--color-gold)';
                    btn.style.color = 'var(--color-black)';
                    btn.disabled = false;
                }, 1500);
            } else {
                showToast('Please fill all required fields correctly.', 'error');
            }
        });

        // Remove error on input change
        resForm.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => {
                input.style.borderColor = 'var(--glass-border)';
            });
        });
    }

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        if (input.value.includes('@')) {
            showToast('Subscribed to newsletter!', 'success');
            newsletterForm.reset();
        } else {
            showToast('Please enter a valid email.', 'error');
        }
    });
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.classList.add('toast', type);

    const icon = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';

    toast.innerHTML = `
            <i class="ph ${icon} text-2xl"></i>
            <span>${message}</span>
        `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

/* --- 11. Button Ripple Effect --- */
document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function (e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple-element');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// --- 12. Hero Carousel ---
const heroSlides = document.querySelectorAll('.carousel-slide');
const heroIndicators = document.getElementById('heroIndicators');
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');
let currentHero = 0;
let heroInterval;

if (heroSlides.length > 0) {
    // Create indicators
    heroSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-indicator');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToHeroSlide(index);
            resetHeroInterval();
        });
        heroIndicators.appendChild(dot);
    });

    const hDots = document.querySelectorAll('.carousel-indicator');

    function goToHeroSlide(index) {
        heroSlides[currentHero].classList.remove('active');
        hDots[currentHero].classList.remove('active');
        currentHero = index;
        heroSlides[currentHero].classList.add('active');
        hDots[currentHero].classList.add('active');
    }

    function nextHeroSlide() { goToHeroSlide((currentHero + 1) % heroSlides.length); }
    function prevHeroSlide() { goToHeroSlide((currentHero - 1 + heroSlides.length) % heroSlides.length); }

    if (heroPrev && heroNext) {
        heroPrev.addEventListener('click', () => { prevHeroSlide(); resetHeroInterval(); });
        heroNext.addEventListener('click', () => { nextHeroSlide(); resetHeroInterval(); });
    }

    function resetHeroInterval() {
        clearInterval(heroInterval);
        heroInterval = setInterval(nextHeroSlide, 5000);
    }

    // Start auto slide
    resetHeroInterval();
}

});
