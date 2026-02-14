// Smooth scroll to sections
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle challenge card clicks
function handleChallengeClick(url) {
    window.location.href = url;
}

// Handle contact form submission
function handleContact(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.elements[0].value;
    const email = form.elements[1].value;
    const message = form.elements[2].value;
    
    // Display success message
    alert(`Thank you, ${name}! Your message has been sent.\nWe'll get back to you at ${email} soon.`);
    
    // Reset form
    form.reset();
    
    // Log the submission
    console.log('Contact form submitted:', { name, email, message });
}

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Initialize page
window.addEventListener('load', () => {
    // Check if user is logged in
    if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
        const username = auth.getCurrentUser();
        updateNavigation(username);
    }
});

// Update navigation based on auth status
function updateNavigation(username) {
    const authNav = document.querySelector('.auth-nav');
    if (authNav) {
        authNav.innerHTML = `
            <span class="username">${username}</span>
            <a href="dashboard.html" class="btn-login">Dashboard</a>
            <button class="logout-btn" onclick="handleLogout()">Logout</button>
        `;
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        if (typeof auth !== 'undefined') {
            auth.logout();
        }
        window.location.href = 'index.html';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'h' to scroll to home
    if (e.key.toLowerCase() === 'h') {
        scrollToSection('home');
    }
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('OSINT CTF Website loaded');
    
    // Add fade-in animation to challenge cards
    const challengeCards = document.querySelectorAll('.challenge-card');
    challengeCards.forEach((card, index) => {
        card.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.1}s`;
    });
});

// Add some animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-links a.active {
        color: #e94560;
        border-bottom: 2px solid #e94560;
    }
`;
document.head.appendChild(style);

console.log('%c🔍 OSINT CTF ', 'background: #e94560; color: white; font-weight: bold; padding: 5px 10px; border-radius: 3px;');
console.log('Welcome to OSINT CTF! Type startChallenge("challenge-type") in console to start.');
