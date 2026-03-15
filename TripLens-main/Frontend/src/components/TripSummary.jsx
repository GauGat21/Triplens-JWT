import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TripSummary.css';
import { authHeader } from '../auth';

const TripSummary = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { tripId } = location.state || {}; // Expect tripId passed from navigation
    const [trip, setTrip] = useState(null);
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tripId) {
            setError("No trip specified.");
            setLoading(false);
            return;
        }

        const fetchTripDetails = async () => {
            try {
                // Fetch Trip Details
                const tripRes = await fetch(`http://localhost:8080/trips/getTripById?tripId=${tripId}`, {
                    method: 'POST'
                });

                if (tripRes.ok) {
                    const tripData = await tripRes.json();
                    setTrip(tripData);

                    // Fetch Itinerary if it exists
                    if (tripData.itineraryId) {
                        try {
                            const itinRes = await fetch(`http://localhost:8080/api/itineraries/getItinerary?itineraryId=${tripData.itineraryId}`, {
                                method: 'POST'
                            });
                            if (itinRes.ok) {
                                const itinData = await itinRes.json();
                                setItinerary(itinData);
                            }
                        } catch (e) {
                            console.error("Error fetching itinerary:", e);
                        }
                    }
                } else {
                    setError("Failed to fetch trip details.");
                }
            } catch (err) {
                console.error(err);
                setError("Network error.");
            } finally {
                setLoading(false);
            }
        };

        fetchTripDetails();
    }, [tripId]);

    const handleEditItinerary = () => {
        // Navigate to CreateItinerary with trip details to "Edit" (or re-plan)
        if (trip) {
            navigate('/create-itinerary', {
                state: {
                    destination: trip.destination,
                    startLocation: trip.startLocation,
                    date: trip.startDate,
                    tripId: trip.id, // Pass ID to link updates
                    initialItinerary: itinerary // Pass existing itinerary to pre-fill
                }
            });
        }
    };

    const handleShareTrip = () => {
        if (trip) {
            navigate('/share-trip', { state: { tripId: trip.id, destination: trip.destination } });
        }
    };

    const goBack = () => navigate('/profile');

    if (loading) return (
        <div className="loading-container">
            <h2>Loading Trip Details...</h2>
        </div>
    );

    if (error || !trip) return (
        <div className="error-container">
            <h2>{error || "Trip Not Found"}</h2>
            <p>We couldn't load the details for this trip.</p>
            <button className="back-btn" onClick={goBack}>Go to Profile</button>
        </div>
    );

    const currentUserId = user ? (user.objectId || user.id || user.userId) : null;

    const canEdit = trip && currentUserId && (
        String(trip.ownerUserId) === String(currentUserId) ||
        (trip.sharedUsers && trip.sharedUsers.some(u => String(u.userId) === String(currentUserId) && u.role === 'EDITOR'))
    );

    return (
        <div className="trip-summary-container">
            {/* ... (Header remains same, not replacing entire file to be safe, just the button part? No, I need 'canEdit' calculated earlier) */}
            {/* Actually, I will insert the variable definition before return, and then update the button */}

            <header className="summary-header">
                <h1>{trip.title || "Trip Summary"}</h1>
                <div className="trip-meta">
                    <p><strong>From:</strong> {trip.startLocation}</p>
                    <p><strong>To:</strong> {trip.destination}</p>
                    <p><strong>Dates:</strong> {trip.startDate} - {trip.endDate}</p>
                    {!canEdit && <span className="badge viewer">Viewer Only</span>}
                </div>
            </header>

            <section className="itinerary-preview">
                <h2>Itinerary Details</h2>
                {/* ... existing itinerary content ... */}
                {itinerary ? (
                    <div className="itinerary-content">
                        {itinerary.hotels && (
                            <div className="summary-card">
                                <h3>Hotel</h3>
                                <p><strong>{itinerary.hotels.name}</strong></p>
                                <p>{itinerary.hotels.address}</p>
                            </div>
                        )}

                        {itinerary.routes && (
                            <div className="summary-card">
                                <h3>Transport: {itinerary.routes.type}</h3>
                                {/* Debug: Remove later if needed */}

                                {(itinerary.routes.type === 'TRAIN' || itinerary.routes.type === 'Train') && (
                                    <div className="transport-detail">
                                        <p>{itinerary.routes.trainName} ({itinerary.routes.trainNumber})</p>
                                        <p>{itinerary.routes.departureTime} ➝ {itinerary.routes.arrivalTime}</p>
                                    </div>
                                )}

                                {(itinerary.routes.type === 'FLIGHT' || itinerary.routes.type === 'Flight') && (
                                    <div className="transport-detail">
                                        <p>{itinerary.routes.airlineName} - {itinerary.routes.flightNumber}</p>
                                        <p>{itinerary.routes.departureTime} ➝ {itinerary.routes.arrivalTime}</p>
                                    </div>
                                )}

                                {(itinerary.routes.type === 'CAR' || itinerary.routes.type === 'Car') && (
                                    <div className="transport-detail">
                                        <p>Road Trip</p>
                                        <p>Distance: {itinerary.routes.distanceKm || 'Unknown'} km</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {itinerary.selectedSpots && itinerary.selectedSpots.length > 0 && (
                            <div className="summary-card">
                                <h3>Attractions</h3>
                                <ul>
                                    {itinerary.selectedSpots.map((s, i) => (
                                        <li key={i}>{s.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No itinerary saved for this trip yet.</p>
                )}

                <div className="actions">
                    {canEdit && (
                        <button className="edit-btn" onClick={handleEditItinerary}>
                            {itinerary ? "Edit Itinerary" : "Create Itinerary"}
                        </button>
                    )}
                    <button className="share-btn" onClick={handleShareTrip}>
                        Share Trip
                    </button>
                </div>
            </section>
        </div>
    );
};

export default TripSummary;
