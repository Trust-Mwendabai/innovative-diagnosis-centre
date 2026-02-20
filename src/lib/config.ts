/**
 * Centralized API Configuration Node
 * Automatically detects the execution environment and sets the appropriate API base URL.
 */

const isDevelopment = import.meta.env.MODE === 'development';

// In production, the API is usually located at /api relative to the root or on a subdomain.
// We assume it's in the /api folder on the same server where the frontend is hosted.
// In development, we might be on localhost:8080 (Vite) while PHP is on localhost (Apache)
// This logic tries to be smart about finding the backend.
export const API_BASE_URL = isDevelopment
    ? (window.location.port !== '' && window.location.port !== '80' ? 'http://localhost/IDC/api' : '/IDC/api')
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
