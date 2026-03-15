// Save token to localStorage after login/register
export const saveToken = (token) => {
    localStorage.setItem("jwt", token);
};

// Get token — used in every API call as the Authorization header
export const getToken = () => {
    return localStorage.getItem("jwt");
};

// Remove token on logout
export const removeToken = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
};

// Check if user is currently logged in (token exists)
export const isLoggedIn = () => {
    return getToken() !== null;
};

// Build the Authorization header — use this in every fetch call
// Usage: fetch(url, { headers: authHeader() })
export const authHeader = () => {
    const token = getToken();
    return token ? { "Authorization": `Bearer ${token}` } : {};
};