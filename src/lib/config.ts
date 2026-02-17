/**
 * Centralized API Configuration Node
 * Automatically detects the execution environment and sets the appropriate API base URL.
 */

const isDevelopment = import.meta.env.MODE === 'development';

// In production, the API is usually located at /api relative to the root or on a subdomain.
// We assume it's in the /api folder on the same server where the frontend is hosted.
export const API_BASE_URL = isDevelopment
    ? 'http://localhost/IDC/api'
    : `${window.location.origin}/api`;

/**
 * Diagnostic protocol for testing API connectivity.
 */
export const checkApiHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health.php`);
        return response.ok;
    } catch (e) {
        return false;
    }
};
