import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { authHeader } from '../auth';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map view bounds based on route
const ChangeView = ({ coords, markers }) => {
    const map = useMap();
    useEffect(() => {
        if (coords && coords.length > 0) {
            map.fitBounds(coords); // coords matches [lat, lng] format already
        } else if (markers && markers.length > 0) {
            const markerCoords = markers.map(m => [m.lat, m.lon]);
            map.fitBounds(markerCoords);
        }
    }, [coords, markers, map]);
    return null;
};

const MapView = ({ routeCoordinates, markers = [] }) => {
    // Default center (Pune/Mumbai approximation or [0,0]) if no route yet
    const defaultCenter = [18.5204, 73.8567];

    return (
        <div className="map-view-container" style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer center={routeCoordinates.length > 0 ? routeCoordinates[0] : defaultCenter} zoom={8} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {routeCoordinates.length > 0 && (
                    <Polyline positions={routeCoordinates} color="blue" weight={5} />
                )}

                {markers.map((marker, idx) => (
                    <Marker key={idx} position={[marker.lat, marker.lon]}>
                        <Tooltip permanent direction="top" offset={[0, -20]} className="custom-tooltip">
                            {marker.name}
                        </Tooltip>
                    </Marker>
                ))}

                <ChangeView coords={routeCoordinates} markers={markers} />
            </MapContainer>
        </div>
    );
};

export default MapView;
