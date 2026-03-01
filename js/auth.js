/**
 * Authentication Module for ATS Services Admin Pages
 * Requires Supabase client to be initialized
 */

const Auth = {
    /**
     * Checks if user is authenticated
     * @returns {Promise<boolean>} True if authenticated
     */
    isAuthenticated: async function () {
        try {
            if (typeof supabaseClient === 'undefined') {
                console.error('Supabase client not initialized');
                return false;
            }

            const { data: { session }, error } = await supabaseClient.auth.getSession();

            if (error) {
                console.error('Auth check error:', error);
                return false;
            }

            return !!session;
        } catch (error) {
            console.error('Authentication check failed:', error);
            return false;
        }
    },

    /**
     * Gets current user
     * @returns {Promise<object|null>} User object or null
     */
    getCurrentUser: async function () {
        try {
            const { data: { user }, error } = await supabaseClient.auth.getUser();

            if (error) {
                console.error('Get user error:', error);
                return null;
            }

            return user;
        } catch (error) {
            console.error('Get current user failed:', error);
            return null;
        }
    },

    /**
     * Checks if user has admin role
     * @returns {Promise<boolean>} True if admin
     */
    isAdmin: async function () {
        try {
            const user = await this.getCurrentUser();

            if (!user) return false;

            // Check user metadata for admin role
            return user.user_metadata?.role === 'admin' ||
                user.app_metadata?.role === 'admin';
        } catch (error) {
            console.error('Admin check failed:', error);
            return false;
        }
    },

    /**
     * Requires authentication - redirects to login if not authenticated
     * Call this at the top of protected pages
     */
    requireAuth: async function () {
        const isAuth = await this.isAuthenticated();

        if (!isAuth) {
            // Store the intended URL to redirect back after login
            sessionStorage.setItem('redirect_after_login', window.location.href);
            window.location.href = 'login.html';
        }
    },

    /**
     * Requires admin role - redirects if not admin
     */
    requireAdmin: async function () {
        await this.requireAuth();

        const isAdminUser = await this.isAdmin();

        if (!isAdminUser) {
            alert('Accès refusé. Vous devez être administrateur.');
            window.location.href = 'index.html';
        }
    },

    /**
     * Redirects to login page
     */
    redirectToLogin: function () {
        sessionStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = 'login.html';
    },

    /**
     * Login with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<object>} Result object
     */
    login: async function (email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Logout current user
     * @returns {Promise<boolean>} True if successful
     */
    logout: async function () {
        try {
            const { error } = await supabaseClient.auth.signOut();

            if (error) {
                console.error('Logout error:', error);
                return false;
            }

            // Clear session storage
            sessionStorage.clear();

            // Redirect to home page
            window.location.href = 'index.html';

            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            return false;
        }
    },

    /**
     * Handle redirect after successful login
     */
    handleLoginRedirect: function () {
        const redirectUrl = sessionStorage.getItem('redirect_after_login');
        sessionStorage.removeItem('redirect_after_login');

        if (redirectUrl && redirectUrl !== window.location.href) {
            window.location.href = redirectUrl;
        } else {
            window.location.href = 'admin.html';
        }
    },

    /**
     * Initialize auth state listener
     */
    initAuthListener: function (onAuthChange) {
        if (typeof supabaseClient === 'undefined') {
            console.error('Supabase client not initialized');
            return;
        }

        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (onAuthChange) {
                onAuthChange(event, session);
            }
        });
    }
};

// Make available globally
window.Auth = Auth;
