import React, { useRef, useState } from 'react';

const GlowingCard = ({ children, className = "" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;

        const rect = divRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`glowing-card-wrapper ${className}`}
        >
            <div
                className="glowing-card-gradient"
                style={{
                    opacity: opacity,
                    background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(56, 189, 248, 1), transparent 60%)`
                }}
            />
            <div className="glowing-card-inner">
                {children}
            </div>
        </div>
    );
};

export default GlowingCard;
