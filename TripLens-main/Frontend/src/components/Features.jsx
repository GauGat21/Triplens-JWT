import React from 'react';

const features = [
    {
        title: "Smart Organization",
        description: "Automatically organize your photos by location and time using AI.",
        icon: "🗺️"
    },
    {
        title: "Secure Cloud",
        description: "Your memories are safe with our military-grade encryption.",
        icon: "🔒"
    },
    {
        title: "Share Instantly",
        description: "Share your trips with friends and family with a single link.",
        icon: "🚀"
    },
    {
        title: "Offline Access",
        description: "Access your itinerary and maps even without internet connection.",
        icon: "📶"
    }
];

import GlowingCard from './GlowingCard';

const Features = () => {
    return (
        <section id="features" className="features">
            <div className="container">
                <div className="section-header">
                    <h2>Why Choose Triplens?</h2>
                    <p>Everything you need to make your travel memories last forever.</p>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <GlowingCard key={index}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </GlowingCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
