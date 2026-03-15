import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { authHeader } from '../auth';

const UserProfile = ({ user }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('created');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchTrips();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchTrips = async () => {
        try {
            const userId = user.objectId || user.id || user.userId;
            const response = await fetch(`http://localhost:8080/trips/getTripsByUserId?userId=${userId}`, {
                method: 'POST'
            });

            if (response.ok) {
                const data = await response.json();
                setTrips(data);
            } else {
                setError("Failed to fetch trips.");
            }
        } catch (err) {
            setError("Network error fetching trips.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTrip = async (e, tripId) => {
        e.stopPropagation(); // Prevent navigating to summary
        if (window.confirm("Are you sure you want to delete this trip?")) {
            try {
                const res = await fetch(`http://localhost:8080/trips/deleteTrip?tripId=${tripId}`, {
                    method: 'POST'
                });
                if (res.ok) {
                    alert("Trip deleted successfully.");
                    fetchTrips(); // Refresh list
                } else {
                    alert("Failed to delete trip.");
                }
            } catch (error) {
                console.error("Delete error", error);
            }
        }
    };

    const handleTripClick = (trip) => {
        navigate('/trip-summary', {
            state: {
                tripId: trip.id
            }
        });
    };

    if (!user) {
        return <div className="error">Please log in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <header className="profile-header">
                <h2>{user.userName}'s Profile</h2>
                <p>Email: {user.email || 'N/A'}</p>
            </header>

            <section className="trips-section">
                <div className="tabs-container">
                    <button
                        className={`tab-btn ${activeTab === 'created' ? 'active' : ''}`}
                        onClick={() => setActiveTab('created')}
                    >
                        My Created Trips
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'shared' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shared')}
                    >
                        Shared With Me
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading trips...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="tab-content">
                        {activeTab === 'created' && (
                            <>
                                {trips.created_trips && trips.created_trips.length > 0 ? (
                                    <div className="trips-list">
                                        {trips.created_trips.map((trip) => (
                                            <div
                                                key={trip.id || trip.tripName}
                                                className="trip-card clickable"
                                                onClick={() => handleTripClick(trip)}
                                            >
                                                <div className="trip-info">
                                                    <h4>{trip.title || trip.tripName}</h4>
                                                    <p>From: {trip.startLocation || trip.origin} ➝ To: {trip.destination}</p>
                                                    <p>Date: {trip.startDate} - {trip.endDate}</p>
                                                </div>
                                                <div className="trip-actions">
                                                    <span className={`trip-status ${trip.status ? 'active' : 'completed'}`}>
                                                        {trip.status ? 'Active' : 'Completed'}
                                                    </span>
                                                    <button
                                                        className="delete-icon-btn"
                                                        onClick={(e) => handleDeleteTrip(e, trip.id)}
                                                        title="Delete Trip"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-trips">No created trips found. Start planning a new one!</div>
                                )}
                            </>
                        )}

                        {activeTab === 'shared' && (
                            <>
                                {trips.shared_trips && trips.shared_trips.length > 0 ? (
                                    <div className="trips-list">
                                        {trips.shared_trips.map((trip) => (
                                            <div
                                                key={trip.id || trip.tripName}
                                                className="trip-card clickable"
                                                onClick={() => handleTripClick(trip)}
                                            >
                                                <div className="trip-info">
                                                    <h4>{trip.title || trip.tripName}</h4>
                                                    <p>From: {trip.startLocation || trip.origin} ➝ To: {trip.destination}</p>
                                                    <p>Date: {trip.startDate} - {trip.endDate}</p>
                                                    <p className="owner-info">Owner ID: {trip.ownerUserId}</p>
                                                </div>
                                                <div className="trip-actions">
                                                    <span className={`trip-status ${trip.status ? 'active' : 'completed'}`}>
                                                        {trip.status ? 'Active' : 'Completed'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-trips">No shared trips found.</div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </section>
        </div >
    );
};

export default UserProfile;
