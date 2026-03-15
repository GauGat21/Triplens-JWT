import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <header id="home" className="hero">
            <div className="container hero-content">
                <h1>Capture Your Journeys with <span className="highlight">Triplens</span></h1>
                <p>The ultimate travel companion for documenting your adventures. seamless, beautiful, and secure.</p>
                <div className="hero-buttons">
                    <Link to="/create-trip" className="btn btn-primary">Start Exploring</Link>

                </div>
            </div>
            <div className="hero-background"></div>
        </header>
    );
};

export default Hero;
