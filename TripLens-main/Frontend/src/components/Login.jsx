import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { saveToken } from '../auth';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Single API call now — /authenticate returns token + user data together
            const response = await fetch('http://localhost:8080/users/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ email, password })
            });

            if (!response.ok) {
                setError('Invalid email or password.');
                return;
            }

            const data = await response.json();

            // Save JWT to localStorage
            saveToken(data.token);

            // Pass full user object to App.jsx (same as before)
            onLogin({
                objectId: data.userId,
                userName: data.userName,
                email: data.email
            });

            navigate('/');

        } catch (err) {
            console.error('Login error:', err);
            if (err.message.includes('Failed to fetch')) {
                setError('Cannot connect to server. Is the backend running on port 8080?');
            } else {
                setError(err.message || 'An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                {message && <div className="alert-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;