import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth';
const ANALYTICS_API_URL = 'http://localhost:5000/api/analytics';
const REVIEWS_API_URL = 'http://localhost:5000/api/reviews';

const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

const login = (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};

// Verify email with token
const verifyEmail = (token) => {
    return axios.get(`${API_URL}/verify-email/${token}`);
};

// Resend verification email
const resendVerification = (email) => {
    return axios.post(`${API_URL}/resend-verification`, { email });
};

const normalizeAuthPayload = (payload = {}) => {
    const token =
        payload?.token ||
        payload?.accessToken ||
        payload?.data?.token ||
        payload?.data?.accessToken ||
        null;

    const user =
        payload?.user ||
        payload?.data?.user ||
        (payload?.firstName || payload?.email ? payload : null);

    return { token, user };
};

// Store user data after login
const setUserData = (userData) => {
    const normalized = normalizeAuthPayload(userData);
    const sessionData = {
        user: normalized.user,
        token: normalized.token,
    };

    localStorage.setItem('user', JSON.stringify(sessionData));
    if (normalized.token) {
        localStorage.setItem('token', normalized.token);
    }
    // Notify components of auth change
    window.dispatchEvent(new Event('authChange'));
};

const logout = () => {
    const token = getAuthToken();
    if (token) {
        axios.post(`${API_URL}/logout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch(err => console.error("Logout API failed", err));
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Notify components of auth change
    window.dispatchEvent(new Event('authChange'));
};

// Handle case when no user in localStorage
const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        const parsed = JSON.parse(userStr);

        // Preferred shape: { user: {...}, token: '...' }
        if (parsed?.user) {
            return {
                user: parsed.user,
                token: parsed.token || localStorage.getItem('token') || null,
            };
        }

        // Backward compatible shape where user object is stored directly
        if (parsed?.firstName || parsed?.email) {
            return {
                user: parsed,
                token: parsed.token || localStorage.getItem('token') || null,
            };
        }

        return null;
    } catch (e) {
        // Corrupted storage should not keep app in broken auth state.
        localStorage.removeItem('user');
        return null;
    }
};

// Check if user is authenticated
const isAuthenticated = () => {
    return !!getAuthToken();
};

// Get auth token for requests
const getAuthToken = () => {
    const user = getCurrentUser();
    return user?.token || localStorage.getItem('token') || null;
};

const getAuthConfig = (params = undefined) => {
    const token = getAuthToken();
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    if (params) {
        config.params = params;
    }

    return config;
};

// NEW: Check if email is verified
const isEmailVerified = () => {
    const user = getCurrentUser();
    return user?.user?.isVerified === true;
};

const getAllUsers = () => {
    const token = getAuthToken();
    return axios.get(`${API_URL}/all-users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

const getProfile = () => {
    const token = getAuthToken();
    return axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

const updateProfile = (profileData) => {
    const token = getAuthToken();
    return axios.put(`${API_URL}/update-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

const deleteUser = (id) => {
    const token = getAuthToken();
    return axios.delete(`${API_URL}/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

const getOverviewAnalytics = (filters = {}) => {
    return axios.get(`${ANALYTICS_API_URL}/overview`, getAuthConfig(filters));
};

const getEventAnalytics = (filters = {}) => {
    return axios.get(`${ANALYTICS_API_URL}/events`, getAuthConfig(filters));
};

const getClubAnalytics = (filters = {}) => {
    return axios.get(`${ANALYTICS_API_URL}/clubs`, getAuthConfig(filters));
};

const getAttendanceAnalytics = (filters = {}) => {
    return axios.get(`${ANALYTICS_API_URL}/attendance`, getAuthConfig(filters));
};

const getTrendAnalytics = (filters = {}) => {
    return axios.get(`${ANALYTICS_API_URL}/trends`, getAuthConfig(filters));
};

const exportCsv = (filters = {}) => {
    return axios.get(`${ANALYTICS_API_URL}/export/csv`, {
        ...getAuthConfig(filters),
        responseType: 'blob'
    });
};

const createReview = (reviewData) => {
    return axios.post(`${REVIEWS_API_URL}`, reviewData, getAuthConfig());
};

const getReviews = (filters = {}) => {
    return axios.get(`${REVIEWS_API_URL}`, getAuthConfig(filters));
};

const getEligibleReviewEvents = () => {
    return axios.get(`${REVIEWS_API_URL}/eligible-events`, getAuthConfig());
};

const getReviewAnalyticsOverview = () => {
    return axios.get(`${REVIEWS_API_URL}/analytics/overview`, getAuthConfig());
};

const getReviewEventAnalytics = (filters = {}) => {
    return axios.get(`${REVIEWS_API_URL}/analytics/events`, getAuthConfig(filters));
};

const getReviewClubAnalytics = (filters = {}) => {
    return axios.get(`${REVIEWS_API_URL}/analytics/clubs`, getAuthConfig(filters));
};

const getReviewTrendAnalytics = (filters = {}) => {
    return axios.get(`${REVIEWS_API_URL}/analytics/trends`, getAuthConfig(filters));
};

export default {
    register,
    login,
    verifyEmail,
    resendVerification,
    logout,
    getCurrentUser,
    isAuthenticated,
    getAuthToken,
    isEmailVerified,
    setUserData,
    getProfile,
    updateProfile,
    getAllUsers,
    deleteUser,
    getOverviewAnalytics,
    getEventAnalytics,
    getClubAnalytics,
    getAttendanceAnalytics,
    getTrendAnalytics,
    exportCsv,
    createReview,
    getReviews,
    getEligibleReviewEvents,
    getReviewAnalyticsOverview,
    getReviewEventAnalytics,
    getReviewClubAnalytics,
    getReviewTrendAnalytics,
};