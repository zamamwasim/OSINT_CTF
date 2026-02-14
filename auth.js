// Authentication and User Management System

class AuthSystem {
    constructor() {
        this.storageKey = 'osint_users';
        this.sessionKey = 'osint_current_user';
        this.progressKey = 'osint_progress';
        this.initializeUsers();
    }

    initializeUsers() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
        if (!localStorage.getItem(this.progressKey)) {
            localStorage.setItem(this.progressKey, JSON.stringify({}));
        }
    }

    // Register a new user
    register(username, email, password) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        
        if (users[username]) {
            return { success: false, message: 'Username already exists!' };
        }
        
        if (username.length < 3) {
            return { success: false, message: 'Username must be at least 3 characters!' };
        }
        
        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters!' };
        }
        
        // Simple hash (not secure, only for demo)
        const passwordHash = btoa(password);
        
        users[username] = {
            username: username,
            email: email,
            passwordHash: passwordHash,
            createdDate: new Date().toISOString(),
            completedChallenges: [],
            totalScore: 0
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return { success: true, message: 'Account created successfully!' };
    }

    // Login user
    login(username, password) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        
        if (!users[username]) {
            return { success: false, message: 'Username not found!' };
        }
        
        const user = users[username];
        const passwordHash = btoa(password);
        
        if (user.passwordHash !== passwordHash) {
            return { success: false, message: 'Incorrect password!' };
        }
        
        sessionStorage.setItem(this.sessionKey, username);
        return { success: true, message: 'Login successful!', user: username };
    }

    // Logout user
    logout() {
        sessionStorage.removeItem(this.sessionKey);
    }

    // Get current logged-in user
    getCurrentUser() {
        return sessionStorage.getItem(this.sessionKey);
    }

    // Check if user is logged in
    isLoggedIn() {
        return sessionStorage.getItem(this.sessionKey) !== null;
    }

    // Get user profile
    getUserProfile(username) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        return users[username] || null;
    }

    // Update user progress
    updateProgress(username, challengeId, flagCorrect = true) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        
        if (!users[username]) return false;
        
        if (!users[username].completedChallenges) {
            users[username].completedChallenges = [];
        }
        
        const challengeRecord = {
            id: challengeId,
            completedDate: new Date().toISOString(),
            flagCorrect: flagCorrect,
            points: flagCorrect ? 100 : 0
        };
        
        // Check if challenge already completed
        const existingIndex = users[username].completedChallenges.findIndex(c => c.id === challengeId);
        if (existingIndex >= 0) {
            users[username].completedChallenges[existingIndex] = challengeRecord;
        } else {
            users[username].completedChallenges.push(challengeRecord);
        }
        
        // Update total score
        users[username].totalScore = users[username].completedChallenges
            .reduce((sum, c) => sum + c.points, 0);
        
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return true;
    }

    // Get user statistics
    getUserStats(username) {
        const user = this.getUserProfile(username);
        if (!user) return null;
        
        const completed = user.completedChallenges || [];
        return {
            username: user.username,
            email: user.email,
            createdDate: user.createdDate,
            totalChallengesCompleted: completed.length,
            totalScore: user.totalScore || 0,
            completedChallenges: completed
        };
    }

    // Get leaderboard
    getLeaderboard(limit = 10) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        const leaderboard = Object.values(users)
            .map(user => ({
                username: user.username,
                score: user.totalScore || 0,
                challengesCompleted: (user.completedChallenges || []).length
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
        
        return leaderboard;
    }

    // Check if challenge is completed
    isChallengeCompleted(username, challengeId) {
        const user = this.getUserProfile(username);
        if (!user) return false;
        
        return user.completedChallenges &&
               user.completedChallenges.some(c => c.id === challengeId && c.flagCorrect);
    }

    // All challenges list
    getAllChallenges() {
        return [
            { id: 'geolocation', name: 'Geolocation', difficulty: 'Easy' },
            { id: 'identification', name: 'Person Identification', difficulty: 'Medium' },
            { id: 'web-recon', name: 'Web Reconnaissance', difficulty: 'Medium' },
            { id: 'data-analysis', name: 'Data Analysis', difficulty: 'Hard' },
            { id: 'accounts', name: 'Account Investigation', difficulty: 'Medium' },
            { id: 'images', name: 'Image Analysis', difficulty: 'Easy' }
        ];
    }
}

// Initialize auth system
const auth = new AuthSystem();
