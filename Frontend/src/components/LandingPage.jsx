import React from 'react';

import Hero from './Hero';
import Features from './Features';
import About from './About';
import Contact from './Contact';
import Footer from './Footer';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <Hero />
            <Features />
            <About />
            <Contact />
            <Footer />
        </div>
    );
};

export default LandingPage;
