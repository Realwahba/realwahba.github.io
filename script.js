// Modern Portfolio JavaScript

// ====== Custom Cursor ======
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;

        cursorOutline.style.left = `${x}px`;
        cursorOutline.style.top = `${y}px`;
    });

    // Enlarge cursor on hover
    document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '32px';
            cursorOutline.style.height = '32px';
        });
    });
}

// ====== Theme Toggle ======
const themeBtn = document.getElementById('theme-btn');
const body = document.body;
const themeIcon = themeBtn.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    body.classList.add('light-theme');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');

    if (body.classList.contains('light-theme')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }

    // Update nav background immediately when theme changes
    updateNavBackground();
});

// ====== Terminal Typing Effect ======
const terminalCmd = document.getElementById('terminal-cmd');
const terminalOutput = document.getElementById('terminal-output');

const commands = [
    {
        cmd: 'whoami',
        output: [
            '<span style="color: var(--accent)">Wahba</span> - Full-Stack Developer',
            'Location: Alexandria, Egypt',
            'Status: Available for work'
        ]
    },
    {
        cmd: 'ls skills/',
        output: [
            'Python/',
            'React/',
            'Node.js/',
            'PHP/',
            'WordPress/',
            'MySQL/'
        ]
    },
    {
        cmd: 'cat about.txt',
        output: [
            'Self-taught developer with a passion for building',
            'exceptional digital experiences. I combine technical',
            'expertise with business intelligence to create',
            'solutions that matter.'
        ]
    }
];

let commandIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeCommand() {
    const currentCommand = commands[commandIndex];

    if (!isDeleting && charIndex <= currentCommand.cmd.length) {
        terminalCmd.textContent = currentCommand.cmd.substring(0, charIndex);
        charIndex++;

        if (charIndex > currentCommand.cmd.length) {
            setTimeout(() => {
                showOutput();
            }, 500);
            return;
        }

        setTimeout(typeCommand, 100);
    } else if (isDeleting && charIndex >= 0) {
        terminalCmd.textContent = currentCommand.cmd.substring(0, charIndex);
        charIndex--;

        if (charIndex < 0) {
            isDeleting = false;
            commandIndex = (commandIndex + 1) % commands.length;
            terminalOutput.innerHTML = '';
            charIndex = 0;
            setTimeout(typeCommand, 500);
            return;
        }

        setTimeout(typeCommand, 50);
    }
}

function showOutput() {
    const currentCommand = commands[commandIndex];
    let outputHTML = '';

    currentCommand.output.forEach((line, index) => {
        setTimeout(() => {
            outputHTML += line + '<br>';
            terminalOutput.innerHTML = outputHTML;

            if (index === currentCommand.output.length - 1) {
                setTimeout(() => {
                    isDeleting = true;
                    typeCommand();
                }, 3000);
            }
        }, index * 100);
    });
}

// Start terminal animation
setTimeout(() => {
    typeCommand();
}, 1000);

// ====== Smooth Scrolling ======
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ====== Navigation Active State ======
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.style.color = 'var(--text-secondary)';
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.style.color = 'var(--text)';
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ====== Magnetic Effect for Cards ======
const magneticElements = document.querySelectorAll('[data-magnetic]');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const moveX = deltaX * 10;
        const moveY = deltaY * 10;

        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

// ====== Intersection Observer for Animations ======
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.bento-card, .project-card, .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ====== Navbar Background on Scroll ======
const nav = document.querySelector('.nav');

function updateNavBackground() {
    const isLightTheme = body.classList.contains('light-theme');

    if (window.scrollY > 50) {
        nav.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.98)' : 'rgba(10, 10, 15, 0.95)';
    } else {
        nav.style.background = isLightTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 10, 15, 0.8)';
    }
}

window.addEventListener('scroll', updateNavBackground);

// ====== Mobile Menu Toggle ======
const navHamburger = document.getElementById('nav-hamburger');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navHamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

    // Animate hamburger
    const spans = navHamburger.querySelectorAll('span');
    if (navHamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

if (navHamburger && navMenu) {
    navHamburger.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking on overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMobileMenu);
    }

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

// ====== Parallax Effect ======
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content, .terminal-window');

    parallaxElements.forEach(el => {
        const speed = 0.3;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ====== Stats Counter Animation ======
function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const statNumber = entry.target.querySelector('h3');
            const targetValue = parseInt(statNumber.textContent);

            if (!isNaN(targetValue)) {
                animateCounter(statNumber, targetValue);
                entry.target.dataset.animated = 'true';
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statObserver.observe(card);
});

// ====== Performance: Reduce Motion for Accessibility ======
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// ====== Preloader (Optional) ======
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ====== Keyboard Navigation ======
document.addEventListener('keydown', (e) => {
    // ESC key to close any overlays
    if (e.key === 'Escape') {
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) {
            lightbox.click();
        }
    }
});

// ====== Image Gallery System ======
const galleryData = {
    pos: [
        { src: 'imgs/POS/pos-login.png', caption: 'Login Screen - Secure authentication system' },
        { src: 'imgs/POS/pos-dashboard.png', caption: 'Dashboard - Real-time analytics & insights' },
        { src: 'imgs/POS/pos-sale.png', caption: 'Sales Interface - Fast checkout process' },
        { src: 'imgs/POS/pos-enter_weight.png', caption: 'Weight Entry - Custom business logic' },
        { src: 'imgs/POS/pos-about.png', caption: 'About - System information' },
        { src: 'imgs/POS/pos-changelog.png', caption: 'Changelog - Version history' }
    ],
    estate: [
        { src: 'imgs/estate/estate-login.png', caption: 'Login Page - User authentication' },
        { src: 'imgs/estate/estate-agent-profile.png', caption: 'Agent Profile - Comprehensive dashboard' },
        { src: 'imgs/estate/estate-contact.png', caption: 'Contact System - Communication interface' },
        { src: 'imgs/estate/estate-wallet.png', caption: 'Wallet System - Transaction management' },
        { src: 'imgs/estate/estate-404.png', caption: 'Error Page - User-friendly 404' }
    ]
};

let currentGallery = [];
let currentImageIndex = 0;

function openGallery(projectType, startIndex = 0) {
    const modal = document.getElementById('gallery-modal');
    currentGallery = galleryData[projectType] || [];
    currentImageIndex = startIndex;

    if (currentGallery.length === 0) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    updateGalleryImage();
    createGalleryThumbnails();
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateGallery(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = currentGallery.length - 1;
    } else if (currentImageIndex >= currentGallery.length) {
        currentImageIndex = 0;
    }

    updateGalleryImage();
}

function updateGalleryImage() {
    const galleryImage = document.getElementById('gallery-image');
    const galleryCounter = document.getElementById('gallery-counter');
    const galleryCaption = document.getElementById('gallery-caption');

    const currentImage = currentGallery[currentImageIndex];

    galleryImage.src = currentImage.src;
    galleryCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
    galleryCaption.textContent = currentImage.caption;

    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.gallery-thumbnails-nav img');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function createGalleryThumbnails() {
    const thumbnailsContainer = document.querySelector('.gallery-thumbnails-nav');
    thumbnailsContainer.innerHTML = '';

    currentGallery.forEach((image, index) => {
        const thumb = document.createElement('img');
        thumb.src = image.src;
        thumb.alt = image.caption;
        thumb.onclick = () => {
            currentImageIndex = index;
            updateGalleryImage();
        };

        if (index === currentImageIndex) {
            thumb.classList.add('active');
        }

        thumbnailsContainer.appendChild(thumb);
    });
}

// Gallery keyboard navigation
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');

    if (modal.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeGallery();
        } else if (e.key === 'ArrowLeft') {
            navigateGallery(-1);
        } else if (e.key === 'ArrowRight') {
            navigateGallery(1);
        }
    }
});

// Close gallery when clicking outside the image
document.getElementById('gallery-modal').addEventListener('click', (e) => {
    if (e.target.id === 'gallery-modal') {
        closeGallery();
    }
});

// ====== EmailJS Contact Form ======
// EmailJS credentials configured
const EMAILJS_CONFIG = {
    publicKey: '0-B8srpKJgkxub595',
    serviceID: 'service_mfrfw6d',
    templateID: 'template_1vbinlv'  // EmailJS will auto-send the linked Auto-Reply
};

// Initialize EmailJS (will only work after you add your keys)
if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
}

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check if EmailJS is configured
        if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY') {
            showFormStatus('error', 'EmailJS is not configured yet. Please check the setup instructions!');
            return;
        }

        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const statusDiv = contactForm.querySelector('.form-status');

        // Disable button and show loading
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        statusDiv.className = 'form-status';
        statusDiv.style.display = 'none';

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            sent_date: new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        // Send email (EmailJS will automatically send the linked Auto-Reply)
        emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, formData)
            .then(function(response) {
                showFormStatus('success', '✅ Message sent successfully! Check your email for confirmation.');
                contactForm.reset();
            })
            .catch(function(error) {
                showFormStatus('error', '❌ Failed to send message. Please try again or contact me directly via email.');
            })
            .finally(function() {
                // Re-enable button
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                btnLoading.style.display = 'none';
            });
    });
}

function showFormStatus(type, message) {
    const statusDiv = document.querySelector('.form-status');
    statusDiv.className = `form-status ${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// ====== Initialize ======
// Portfolio initialization complete
