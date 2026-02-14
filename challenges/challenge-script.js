// Check authentication
function checkUserAuth() {
    if (typeof auth !== 'undefined') {
        return auth.isLoggedIn();
    }
    return false;
}

// Get challenge ID from current page
function getChallengeId() {
    const pathname = window.location.pathname;
    return pathname.split('/').pop().replace('.html', '');
}

// Go back to challenges page
function goBack() {
    const currentUser = typeof auth !== 'undefined' ? auth.getCurrentUser() : null;
    if (currentUser) {
        window.location.href = '../dashboard.html';
    } else {
        window.location.href = '../index.html#challenges';
    }
}

// Toggle hint visibility
function toggleHint(button) {
    const content = button.nextElementSibling;
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
    button.style.backgroundColor = content.style.display === 'none' ? '' : 'rgba(15, 52, 96, 0.7)';
}

// Submit flag
function submitFlag() {
    const input = document.getElementById('flagInput');
    const feedback = document.getElementById('feedback');
    const flagValue = input.value.trim().toUpperCase();
    
    // Clear previous feedback
    feedback.classList.remove('show', 'success', 'error');
    
    if (!flagValue) {
        feedback.textContent = '❌ Please enter a flag!';
        feedback.classList.add('show', 'error');
        return;
    }
    
    // Simple flag validation (starts with FLAG{)
    if (!flagValue.startsWith('FLAG{') || !flagValue.endsWith('}')) {
        feedback.textContent = '❌ Invalid format! Use FLAG{answer}';
        feedback.classList.add('show', 'error');
        return;
    }
    
    // Simulate flag checking (in real scenario, would verify against backend)
    const flagContent = flagValue.substring(5, flagValue.length - 1);
    
    if (flagContent.length < 1) {
        feedback.textContent = '❌ Flag content cannot be empty!';
        feedback.classList.add('show', 'error');
        return;
    }
    
    // Success feedback
    feedback.innerHTML = `✅ <strong>Submission recorded!</strong><br>Your flag has been submitted for verification.`;
    feedback.classList.add('show', 'success');
    
    // Log submission
    console.log('Flag submitted:', flagValue);
    
    // Track progress if user is logged in
    if (typeof auth !== 'undefined' && auth.isLoggedIn()) {
        const username = auth.getCurrentUser();
        const challengeId = getChallengeId();
        auth.updateProgress(username, challengeId, true);
        console.log('Progress saved for user:', username);
    }
    
    // Clear input after 2 seconds
    setTimeout(() => {
        input.value = '';
    }, 2000);
}

// Allow Enter key to submit flag
document.addEventListener('DOMContentLoaded', () => {
    const flagInput = document.getElementById('flagInput');
    if (flagInput) {
    
    // Show login prompt if not logged in
    if (typeof auth === 'undefined' || !auth.isLoggedIn()) {
        console.log('User not logged in - progress will not be saved');
    }
        flagInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitFlag();
            }
        });
    }
    
    console.log('Challenge page loaded successfully');
});

// Easy keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'h' to toggle hints
    if (e.key.toLowerCase() === 'h' && e.ctrlKey) {
        e.preventDefault();
        const hints = document.querySelectorAll('.hint-toggle');
        hints.forEach(hint => {
            const content = hint.nextElementSibling;
            if (content.style.display !== 'block') {
                toggleHint(hint);
            }
        });
    }
});

// Auto-save flag to localStorage
window.addEventListener('beforeunload', () => {
    const flagInput = document.getElementById('flagInput');
    if (flagInput && flagInput.value) {
        localStorage.setItem('lastFlag', flagInput.value);
    }
});

// Restore flag from localStorage if exists
window.addEventListener('load', () => {
    const flagInput = document.getElementById('flagInput');
    if (flagInput) {
        const savedFlag = localStorage.getItem('lastFlag');
        if (savedFlag) {
            flagInput.value = savedFlag;
        }
    }
});
