// Auth page functions

function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
    
    // Clear feedbacks
    document.getElementById('login-feedback').textContent = '';
    document.getElementById('register-feedback').textContent = '';
    document.getElementById('login-feedback').className = 'feedback';
    document.getElementById('register-feedback').className = 'feedback';
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const feedback = document.getElementById('login-feedback');
    
    const result = auth.login(username, password);
    
    feedback.textContent = result.message;
    feedback.className = result.success ? 'feedback success' : 'feedback error';
    
    if (result.success) {
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const feedback = document.getElementById('register-feedback');
    
    if (password !== confirm) {
        feedback.textContent = 'Passwords do not match!';
        feedback.className = 'feedback error';
        return;
    }
    
    const result = auth.register(username, email, password);
    
    feedback.textContent = result.message;
    feedback.className = result.success ? 'feedback success' : 'feedback error';
    
    if (result.success) {
        setTimeout(() => {
            // Auto-login after registration
            auth.login(username, password);
            window.location.href = 'dashboard.html';
        }, 1500);
    }
}

// Create demo account on first visit
window.addEventListener('load', () => {
    const users = JSON.parse(localStorage.getItem('osint_users'));
    if (!users['demo']) {
        auth.register('demo', 'demo@osintctf.com', 'demo123');
        console.log('Demo account created!');
    }
});
