import React from 'react';

const About = () => {
    return (
        <section id="about" className="about">
            <div className="container">
                <div className="section-header">
                    <h2>About Triplens</h2>
                    <p>Your ultimate companion for documenting and sharing travel experiences.</p>
                </div>
                <div className="about-content">
                    <div className="about-text">
                        <p>
                            Triplens was born from a passion for exploration and the desire to keep travel memories alive.
                            We believe that every journey tells a story, and those stories deserve to be captured in a way
                            that is both beautiful and secure.
                        </p>
                        <p>
                            Whether you're a solo backpacker, a family on vacation, or a digital nomad, Triplens provides
                            the tools you need to organize your itineraries, document your favorite spots, and share your
                            adventures with the world.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
