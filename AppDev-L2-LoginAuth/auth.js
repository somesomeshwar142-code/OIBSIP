/**
 * SecureAuth Client-Side Cryptographic Authentication Engine
 * Pure Vanilla JS using SHA-256 Web Crypto API & LocalStorage Session Guards
 */

class AuthEngine {
    // 1. Convert String to SHA-256 Hex Hash via Web Crypto API
    static async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 2. Fetch registered user repository from localStorage
    static getUsers() {
        return JSON.parse(localStorage.getItem('auth_users')) || [];
    }

    // 3. Save user repository to localStorage
    static saveUsers(users) {
        localStorage.setItem('auth_users', JSON.stringify(users));
    }

    // 4. Register New Account
    static async register(username, email, password) {
        // Validation Rule 1: Min 8 chars
        if (password.length < 8) {
            return { success: false, message: 'Password must be at least 8 characters long.' };
        }

        // Validation Rule 2: At least 1 number
        if (!/\d/.test(password)) {
            return { success: false, message: 'Password must contain at least 1 number.' };
        }

        const users = this.getUsers();

        // Check duplicates (Username or Email)
        const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
        if (usernameExists) {
            return { success: false, message: 'An account with this username already exists.' };
        }

        const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (emailExists) {
            return { success: false, message: 'An account with this email address already exists.' };
        }

        // Generate SHA-256 Password Hash (Never store raw plain text!)
        const passwordHash = await this.hashPassword(password);

        const newUser = {
            id: Date.now().toString(),
            username: username,
            email: email,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        return { success: true, message: 'Account registered successfully.' };
    }

    // 5. Login Authenticator
    static async login(identifier, password) {
        const users = this.getUsers();
        const inputHash = await this.hashPassword(password);
        const cleanIdentifier = identifier.toLowerCase();

        // Search user by Username or Email
        const user = users.find(u => 
            u.username.toLowerCase() === cleanIdentifier || 
            u.email.toLowerCase() === cleanIdentifier
        );

        // Security requirement: Generic error message to prevent account enumeration
        if (!user || user.passwordHash !== inputHash) {
            return { success: false, message: 'Invalid username/email or password.' };
        }

        // Create Active Session
        const session = {
            userId: user.id,
            username: user.username,
            email: user.email,
            loginTime: new Date().toISOString(),
            sessionToken: 'sess_' + Math.random().toString(36).substring(2, 15)
        };

        localStorage.setItem('auth_session', JSON.stringify(session));
        return { success: true, message: 'Authentication successful.' };
    }

    // 6. Session Management Helpers
    static getSession() {
        return JSON.parse(localStorage.getItem('auth_session')) || null;
    }

    static logout() {
        localStorage.removeItem('auth_session');
    }

    // 7. UI Alert Banner Utility
    static showAlert(element, message, type = 'danger') {
        if (!element) return;
        element.className = `alert-banner ${type}`;
        element.textContent = message;
        element.style.display = 'block';
    }
}
