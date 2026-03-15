import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTrip.css';
import { authHeader } from '../auth';

const CreateTrip = ({ user }) => {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!user) {
            navigate('/login', { state: { message: "Please sign up or login to create a trip" } });
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        startLocation: '',
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 1
    });
    const [loading, setLoading] = useState(false);

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('User:', user);
            // Handle case where user might be a string (legacy) or object
            let userId = user?.objectId || user?.id;

            // SAFETY CHECK: If userId is an object (stale data from before the backend fix), force re-login
            if (typeof userId === 'object') {
                alert("Session data update required. Please login again.");
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }

            if (!userId) {
                // If user exists but no ID (e.g. legacy string), force logout
                if (user) {
                    alert("Session expired or invalid. Please login again.");
                    localStorage.removeItem('user');
                    navigate('/login');
                    return;
                }
                throw new Error("User ID not found. Please login again.");
            }

            const response = await fetch(`http://127.0.0.1:8080/trips/addTrip?userId=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    ...authHeader()   // adds Authorization: Bearer <token>
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const tripId = await response.text();
                // alert('Trip created successfully!'); // Optional: remove or keep
                navigate('/create-itinerary', {
                    state: {
                        tripId: tripId,
                        destination: formData.destination,
                        startLocation: formData.startLocation,
                        startDate: formData.startDate,
                        endDate: formData.endDate
                    }
                });
            } else {
                throw new Error('Failed to create trip');
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            if (error.message === 'Failed to fetch') {
                alert('Error: Backend server is not reachable. Please ensure the server is running on port 8080.');
            } else {
                alert(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-trip-container">
            <div className="create-trip-card">
                <h2>Plan Your Next Adventure</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="startLocation">Starting Location</label>
                        <input
                            type="text"
                            id="startLocation"
                            name="startLocation"
                            value={formData.startLocation}
                            onChange={handleChange}
                            placeholder="e.g., New York, London"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="destination">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                            placeholder="e.g., Paris, Tokyo"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                min={today}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                min={formData.startDate || today}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="travelers">Travelers</label>
                        <div className="travelers-input-group">
                            <button
                                type="button"
                                className="counter-btn"
                                onClick={() => setFormData(prev => ({ ...prev, travelers: Math.max(1, parseInt(prev.travelers) - 1) }))}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                id="travelers"
                                name="travelers"
                                value={formData.travelers}
                                onChange={handleChange}
                                min="1"
                                required
                                className="travelers-input"
                            />
                            <button
                                type="button"
                                className="counter-btn"
                                onClick={() => setFormData(prev => ({ ...prev, travelers: parseInt(prev.travelers) + 1 }))}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Creating Trip...' : 'Create Trip'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTrip;
