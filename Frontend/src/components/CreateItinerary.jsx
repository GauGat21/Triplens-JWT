import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapView from './MapView';
import './CreateItinerary.css';

import { authHeader } from '../auth';

const getRandomHotelImage = (index) => {
    const images = [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80', // Resort
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=500&q=80', // Luxury
        'https://images.unsplash.com/photo-1571896349842-6e5c4e375615?auto=format&fit=crop&w=500&q=80', // Bedroom
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80', // Pool
        'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=500&q=80', // Modern
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=500&q=80', // Cozy
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=500&q=80', // Boutique
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=500&q=80', // Classic
        'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=500&q=80', // City View
        'https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?auto=format&fit=crop&w=500&q=80', // Tropical
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&q=80', // Business
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=500&q=80', // Modern Room
        'https://images.unsplash.com/photo-1590490360182-c33d57733527?auto=format&fit=crop&w=500&q=80', // Lounge
        'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=500&q=80', // Spa
        'https://images.unsplash.com/photo-1560200353-ce0a76b1d438?auto=format&fit=crop&w=500&q=80', // Business Center
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=500&q=80', // Balcony
        'https://images.unsplash.com/photo-1522771753035-4848230d3fad?auto=format&fit=crop&w=500&q=80'  // Minimalist
    ];
    // Use index to deterministically pick an image so it doesn't change on re-render
    return images[index % images.length];
};

const CreateItinerary = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { destination, startLocation, date, tripId, initialItinerary } = location.state || { destination: 'Paris', startLocation: 'London', date: '' };

    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [transportMode, setTransportMode] = useState('train');
    const [trains, setTrains] = useState([]);
    const [flights, setFlights] = useState([]);
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [transportRouteCoordinates, setTransportRouteCoordinates] = useState([]);
    const [transportDistance, setTransportDistance] = useState(0);
    const [error, setError] = useState('');

    const [markers, setMarkers] = useState([]);

    // Tourist Spots & Adventure Map State
    const [touristSpots, setTouristSpots] = useState([]);
    const [selectedSpots, setSelectedSpots] = useState([]);
    const [adventureRoute, setAdventureRoute] = useState([]);
    const [adventureMarkers, setAdventureMarkers] = useState([]);

    // Festivals State
    const [festivals, setFestivals] = useState([]);

    // Hydrate state for Edit Mode
    useEffect(() => {
        if (initialItinerary) {
            setSelectedHotel(initialItinerary.hotels);
            if (initialItinerary.routes) {
                const type = initialItinerary.routes.type?.toLowerCase() || 'train';
                setTransportMode(type);
                setSelectedTransport(initialItinerary.routes);
                if (type === 'car' && initialItinerary.routes.distanceKm) {
                    setTransportDistance(initialItinerary.routes.distanceKm);
                }
            }
            if (initialItinerary.selectedSpots) {
                setSelectedSpots(initialItinerary.selectedSpots);
            }
            if (initialItinerary.festivals) {
                setFestivals(initialItinerary.festivals);
            }
            // Hydrate Adventure Route if exists
            if (initialItinerary.adventureRouteCoordinates) {
                setAdventureRoute(initialItinerary.adventureRouteCoordinates);
            }
        }
    }, [initialItinerary]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Hotels
                if (destination) {
                    try {
                        // Capitalize destination for backend compatibility
                        const formattedDestination = destination.charAt(0).toUpperCase() + destination.slice(1).toLowerCase();
                        const hotelRes = await fetch(`http://localhost:8080/api/hotels/${formattedDestination}`);
                        if (hotelRes.ok) {
                            const hotelData = await hotelRes.json();
                            setHotels(hotelData);
                        }
                    } catch (e) {
                        console.error("Hotel fetch error", e);
                    }

                    // Fetch Tourist Spots
                    try {
                        const spotRes = await fetch(`http://localhost:8080/api/spots/nearby?location=${destination}`);
                        if (spotRes.ok) {
                            const spotData = await spotRes.json();
                            setTouristSpots(spotData);
                        }
                    } catch (e) {
                        console.error("Spot fetch error", e);
                    }

                    // Fetch Festivals
                    try {
                        const festRes = await fetch(`http://localhost:8080/api/festivals?city=${destination}`);
                        if (festRes.ok) {
                            const festData = await festRes.json();
                            setFestivals(festData);
                        }
                    } catch (e) {
                        console.error("Festival fetch error", e);
                    }
                }

                if (startLocation && destination) {
                    // Fetch Trains
                    try {
                        const trainRes = await fetch(`http://localhost:8080/api/trains/search?origin=${startLocation}&destination=${destination}`, {
                            method: 'POST'
                        });
                        if (trainRes.ok) {
                            const trainData = await trainRes.json();
                            setTrains(trainData);
                        }
                    } catch (e) {
                        console.error("Train fetch error", e);
                    }

                    // Fetch Flights
                    try {
                        const flightRes = await fetch(`http://localhost:8080/api/flights/search?from=${startLocation}&to=${destination}&date=${date || ''}`);
                        if (flightRes.ok) {
                            const flightData = await flightRes.json();
                            setFlights(flightData);
                        }
                    } catch (e) {
                        console.error("Flight fetch error", e);
                    }

                    // Fetch Route for Car (Restore Map Feature)
                    try {
                        const fetchCoords = async (city) => {
                            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
                            const data = await res.json();
                            if (data && data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                            return null;
                        };

                        const startCoords = await fetchCoords(startLocation);
                        const destCoords = await fetchCoords(destination);

                        if (startCoords && destCoords) {
                            // Set Markers
                            setMarkers([
                                { lat: startCoords[0], lon: startCoords[1], name: `Start: ${startLocation}` },
                                { lat: destCoords[0], lon: destCoords[1], name: `Destination: ${destination}` }
                            ]);

                            // Get Route
                            const routeRes = await fetch(`http://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`);
                            const routeData = await routeRes.json();

                            if (routeData.routes && routeData.routes.length > 0) {
                                const coordinates = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]); // Swap to [lat, lon]
                                setTransportRouteCoordinates(coordinates);
                                setTransportDistance((routeData.routes[0].distance / 1000).toFixed(2)); // toFixed(2) returns string, but works for display
                            }
                        }
                    } catch (e) {
                        console.error("Route fetch error", e);
                        setError("Could not load map route.");
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load some data. Please check backend connection.");
            }
        };

        fetchData();
    }, [destination, startLocation, date]);

    const handleSpotSelect = (spot) => {
        const spotName = spot.name || spot.title;
        const isSelected = selectedSpots.some(s => (s.name || s.title) === spotName);

        if (isSelected) {
            setSelectedSpots(selectedSpots.filter(s => (s.name || s.title) !== spotName));
        } else {
            setSelectedSpots([...selectedSpots, spot]);
        }
    };

    const handleGenerateAdventureRoute = async () => {
        if (selectedSpots.length < 2) {
            alert("Please select at least 2 spots to generate a route.");
            return;
        }

        const spotsWithCoords = await Promise.all(selectedSpots.map(async (spot) => {
            if (spot.lat && spot.lon) return { ...spot, lat: parseFloat(spot.lat), lon: parseFloat(spot.lon) };
            // Fallback to geocoding if lat/lon missing
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${spot.title || spot.name}`);
                const data = await res.json();
                if (data && data.length > 0) return { ...spot, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
            } catch (e) { console.error("Geocode error for spot", spot); }
            return null;
        }));

        const validSpots = spotsWithCoords.filter(s => s !== null);
        setAdventureMarkers(validSpots.map(s => ({ lat: s.lat, lon: s.lon, name: s.title || s.name })));

        if (validSpots.length < 2) {
            alert("Could not find coordinates for enough spots.");
            return;
        }

        // OSRM Trip API (Optimized)
        const coordString = validSpots.map(s => `${s.lon},${s.lat}`).join(';');

        try {
            const tripRes = await fetch(`http://router.project-osrm.org/trip/v1/driving/${coordString}?overview=full&geometries=geojson`);
            const tripData = await tripRes.json();
            if (tripData.trips && tripData.trips.length > 0) {
                const coordinates = tripData.trips[0].geometry.coordinates.map(c => [c[1], c[0]]);
                setAdventureRoute(coordinates);
            }
        } catch (e) {
            console.error("Trip gen error", e);
        }
    };

    const handleHotelSelect = (hotel) => {
        setSelectedHotel(hotel === selectedHotel ? null : hotel);
    };

    const handleTransportChange = (mode) => {
        setTransportMode(mode);
        // Auto-select 'Car' since there are no specific sub-options to choose from
        if (mode === 'car') {
            setSelectedTransport('Car');
        } else {
            setSelectedTransport(null); // Reset for Train/Flight to force specific selection
        }
    };

    const handleTransportSelect = (transport) => {
        setSelectedTransport(transport === selectedTransport ? null : transport);
    };

    const handleSaveItinerary = async () => {
        if (!selectedHotel || !selectedTransport) {
            alert("Please select both a hotel and a transport mode.");
            return;
        }

        // Construct Route Object based on Transport Mode (Mapping to backend entities)
        // Construct Route Object based on Transport Mode (Mapping to backend entities)
        let routeObj = null;
        if (transportMode === 'car' || selectedTransport === 'Car') {
            routeObj = {
                type: "CAR",
                distanceKm: parseFloat(transportDistance || 0),
                fuelCost: (parseFloat(transportDistance || 0) * 12).toFixed(2) // Approx fuel cost
            };
        } else if (transportMode === 'train' && selectedTransport) {
            routeObj = {
                ...selectedTransport,
                type: "TRAIN"
            };
        } else if (transportMode === 'flight' && selectedTransport) {
            // Handle both raw API response (nested) and pre-saved entity (flat)
            routeObj = {
                airlineName: selectedTransport.airlineName || selectedTransport.airline?.name,
                flightNumber: selectedTransport.flightNumber || selectedTransport.number,
                departureTime: selectedTransport.departureTime || selectedTransport.movement?.scheduledTime?.local,
                arrivalTime: selectedTransport.arrivalTime,
                price: parseFloat(selectedTransport.price || 0),
                type: "FLIGHT"
            };
        }

        const payload = {
            dayPlans: [`Day 1 in ${destination}`], // Placeholder structure
            hotels: selectedHotel,
            routes: routeObj,
            festivals: festivals, // Saving all fetched festivals for now
            selectedSpots: selectedSpots.map(s => ({
                name: s.name || s.title,
                description: s.description,
                image_url: s.image_url || s.thumbnail
            })),
            adventureRouteCoordinates: adventureRoute
        };

        try {
            // Use tripId from state or a default/generated one if missing (for testing)
            const activeTripId = tripId || "65b925a07567890123456789";

            let res;
            if (initialItinerary && initialItinerary.id) {
                // UPDATE existing itinerary
                res = await fetch(`http://localhost:8080/api/itineraries/updateItinerary?itineraryId=${initialItinerary.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // CREATE new itinerary
                res = await fetch(`http://localhost:8080/api/itineraries/addItinerary?tripId=${activeTripId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                alert("Itinerary saved successfully!");
                // Navigate to Share Trip page instead of Profile
                navigate('/share-trip', { state: { tripId: activeTripId, destination } });
            } else {
                const errorText = await res.text();
                console.error("Save failed:", res.status, errorText);
                alert(`Failed to save: Server returned ${res.status} ${res.statusText}. Details: ${errorText}`);
            }
        } catch (e) {
            console.error("Save error", e);
            alert(`Error saving itinerary: ${e.message}. \n\nCheck console for details. Ensure backend is running and supported.`);
        }
    };

    // Scroll Spy Logic
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.5 }); // 50% visibility triggers change

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="itinerary-container">
            <div className="vertical-nav">
                <button
                    onClick={() => scrollToSection('hotels')}
                    className={`nav-dot ${activeSection === 'hotels' ? 'active' : ''}`}
                    title="Hotels"
                >
                    🏨
                </button>
                <button
                    onClick={() => scrollToSection('attractions')}
                    className={`nav-dot ${activeSection === 'attractions' ? 'active' : ''}`}
                    title="Attractions"
                >
                    🎡
                </button>
                <button
                    onClick={() => scrollToSection('festivals')}
                    className={`nav-dot ${activeSection === 'festivals' ? 'active' : ''}`}
                    title="Festivals"
                >
                    🎉
                </button>
                <button
                    onClick={() => scrollToSection('transport')}
                    className={`nav-dot ${activeSection === 'transport' ? 'active' : ''}`}
                    title="Transport"
                >
                    ✈️
                </button>
            </div>

            <div className="itinerary-header">
                <h1>Trip to {destination}</h1>
                {startLocation && <p>Starting from: {startLocation}</p>}
            </div>

            {/* Hotels Section */}
            <section id="hotels" className="section-hotels">
                <h2>Stay in Comfort</h2>
                {/* ... existing hotel code ... */}
                <div className="hotel-list">
                    {hotels.length > 0 ? (
                        hotels.map((hotel, index) => {
                            const handleMouseMove = (e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                            };

                            return (
                                <div
                                    key={index}
                                    className={`hotel-card ${selectedHotel === hotel ? 'selected' : ''}`}
                                    onClick={() => handleHotelSelect(hotel)}
                                    onMouseMove={handleMouseMove}
                                >
                                    <img
                                        src={hotel.imageUrl || getRandomHotelImage(index)}
                                        alt={hotel.name || "Hotel"}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80";
                                        }}
                                    />
                                    <div className="hotel-info">
                                        <h3>{hotel.name}</h3>
                                        <p className="rating">⭐ {hotel.rating || '4.5'}</p>
                                        <p className="price">₹{hotel.pricePerNight || '2500'}/night</p>
                                        <p className="address">{hotel.address || destination}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="error-message">
                            <p>No hotels found in {destination}.</p>
                            {error && <p className="error-text">Backend Error: {error}</p>}
                            {!error && <p>Loading or no data available...</p>}
                        </div>
                    )}
                </div>
            </section>

            {/* Tourist Spots Section */}
            <section id="attractions" className="section-attractions">
                <h2>Explore Attractions</h2>
                <div className="attraction-grid">
                    {touristSpots.length > 0 ? (
                        touristSpots.map((spot, index) => {
                            const handleMouseMove = (e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                            };
                            return (
                                <div
                                    key={index}
                                    className={`attraction-card ${selectedSpots.some(s => (s.name || s.title) === (spot.name || spot.title)) ? 'selected' : ''}`}
                                    onClick={() => handleSpotSelect(spot)}
                                    onMouseMove={handleMouseMove}
                                >
                                    {/* Use image_url from backend (Wiki Scraper) */}
                                    <img src={spot.image_url || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500"} alt={spot.title || spot.name} />
                                    <div className="attraction-info">
                                        <h3>{spot.title || spot.name}</h3>
                                        <p>{spot.description ? spot.description.substring(0, 80) + "..." : "Interesting place to visit"}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="error-message">
                            {error ? <p className="error-text">Backend Error: {error}</p> : <p>Loading attractions...</p>}
                        </div>
                    )}
                </div>

                <div className="adventure-actions">
                    <button className="generate-route-btn" onClick={handleGenerateAdventureRoute} disabled={selectedSpots.length < 2}>
                        Generate Adventure Route 🗺️
                    </button>
                    {selectedSpots.length < 2 && <p className="hint-text">Select at least 2 spots to see the route.</p>}
                </div>

                {/* Adventure Map */}
                {adventureRoute.length > 0 && (
                    <div className="adventure-map-container" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' }}>
                        <h3>Top Adventure Route</h3>
                        <MapView routeCoordinates={adventureRoute} markers={adventureMarkers} />
                    </div>
                )}
            </section>

            {/* Festivals Section */}
            <section id="festivals" className="section-festivals">
                <h2>Local Festivals</h2>
                <div className="festival-list">
                    {festivals.length > 0 ? (
                        festivals.map((fest, index) => (
                            <div key={index} className="festival-card">
                                <h3>{fest.name}</h3>
                                <p><strong>Month:</strong> {fest.month}</p>
                            </div>
                        ))
                    ) : (
                        <p>{error ? "Could not load festivals." : `No festivals found for ${destination || 'this location'}.`}</p>
                    )}
                </div>
            </section>

            {/* Transport Selection Section */}
            <section id="transport" className="section-transport">
                <h2>Choose Your Travel Mode</h2>
                <div className="transport-tabs">
                    <button
                        className={transportMode === 'train' ? 'active' : ''}
                        onClick={() => handleTransportChange('train')}
                    >
                        🚆 Train
                    </button>
                    <button
                        className={transportMode === 'flight' ? 'active' : ''}
                        onClick={() => handleTransportChange('flight')}
                    >
                        ✈️ Flight
                    </button>
                    <button
                        className={transportMode === 'car' ? 'active' : ''}
                        onClick={() => handleTransportChange('car')}
                    >
                        🚗 Car
                    </button>
                </div>

                <div className="transport-content">
                    {transportMode === 'train' && (
                        <div className="train-list">
                            {trains.length > 0 ? (
                                trains.map((train, idx) => (
                                    <div
                                        key={idx}
                                        className={`transport-option ${selectedTransport === train ? 'selected' : ''}`}
                                        onClick={() => handleTransportSelect(train)}
                                    >
                                        <h4>{train.trainName} ({train.trainNumber})</h4>
                                        <p>Departs: {train.departureTime} | Arrives: {train.arrivalTime}</p>
                                        <p>Duration: {train.duration}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No trains found between these cities.</p>
                            )}
                        </div>
                    )}

                    {transportMode === 'flight' && (
                        <div className="flight-list">
                            {flights.length > 0 ? (
                                flights.map((flight, idx) => (
                                    <div
                                        key={idx}
                                        className={`transport-option ${selectedTransport === flight ? 'selected' : ''}`}
                                        onClick={() => handleTransportSelect(flight)}
                                    >
                                        <h4>{flight.airline?.name || 'Airline'} - {flight.number || 'Flight'}</h4>
                                        <p>Price: ₹{flight.price || '5000'}</p>
                                        <p>{flight.movement?.scheduledTime?.local?.split(' ')[1] || 'Departure'} ➝ {flight.arrivalTime || 'Arrival'}</p>
                                    </div>
                                ))
                            ) : (
                                <p>{error ? "Flight service unavailable." : "No flights found for this date."}</p>
                            )}
                        </div>
                    )}

                    {transportMode === 'car' && (
                        <div className="car-option">
                            <p><strong>Road Trip:</strong> {startLocation} ➝ {destination}</p>
                            {transportRouteCoordinates.length > 0 ? (
                                <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginTop: '10px' }}>
                                    <MapView routeCoordinates={transportRouteCoordinates} markers={markers} />
                                </div>
                            ) : (
                                <p>{error ? <span style={{ color: 'red' }}>{error}</span> : "Loading route..."}</p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <button className="save-btn" onClick={handleSaveItinerary}>
                Save Itinerary
            </button>
        </div>
    );
};

export default CreateItinerary;
