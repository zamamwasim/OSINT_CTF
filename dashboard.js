// Dashboard functionality

function checkAuth() {
    if (!auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function loadDashboard() {
    const username = auth.getCurrentUser();
    const stats = auth.getUserStats(username);
    const leaderboard = auth.getLeaderboard();
    
    // Update welcome text
    document.getElementById('welcome-text').textContent = `Welcome back, ${username}!`;
    document.getElementById('username-display').textContent = username;
    
    // Update stats
    document.getElementById('total-score').textContent = stats.totalScore;
    document.getElementById('challenges-completed').textContent = stats.totalChallengesCompleted;
    
    const completionRate = Math.round((stats.totalChallengesCompleted / 6) * 100);
    document.getElementById('completion-rate').textContent = completionRate + '%';
    
    // Find leaderboard rank
    const rank = leaderboard.findIndex(player => player.username === username) + 1;
    document.getElementById('leaderboard-rank').textContent = rank > 0 ? '#' + rank : '-';
    
    // Load challenges
    loadChallenges(stats.completedChallenges);
    
    // Load leaderboard
    loadLeaderboard(leaderboard);
}

function loadChallenges(completedChallenges) {
    const challenges = auth.getAllChallenges();
    const container = document.getElementById('challengesList');
    
    const completedIds = completedChallenges.map(c => c.id);
    
    container.innerHTML = challenges.map(challenge => {
        const isCompleted = completedIds.includes(challenge.id);
        const checkmark = isCompleted ? '✅' : '⭕';
        
        return `
            <div class="challenge-progress-item ${isCompleted ? 'completed' : ''}">
                <div class="challenge-info">
                    <span class="challenge-check">${checkmark}</span>
                    <div class="challenge-details">
                        <h3>${challenge.name}</h3>
                        <span class="difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
                    </div>
                </div>
                <a href="challenges/${challenge.id}.html" class="btn-small">
                    ${isCompleted ? 'Review' : 'Start'}
                </a>
            </div>
        `;
    }).join('');
}

function loadLeaderboard(leaderboard) {
    const tbody = document.getElementById('leaderboardBody');
    
    tbody.innerHTML = leaderboard.map((player, index) => `
        <tr>
            <td class="rank">${index + 1}</td>
            <td class="username">${player.username}</td>
            <td class="score">${player.score}</td>
            <td class="challenges">${player.challengesCompleted}/6</td>
        </tr>
    `).join('');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
        window.location.href = 'login.html';
    }
}

// Initialize dashboard on page load
window.addEventListener('load', () => {
    if (checkAuth()) {
        loadDashboard();
    }
});
