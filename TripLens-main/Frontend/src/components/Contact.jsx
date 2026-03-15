import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="contact">
            <div className="container">
                <div className="section-header">
                    <h2>Get in Touch</h2>
                    <p>Have questions or feedback? We'd love to hear from you.</p>
                </div>
                <div className="contact-content">
                    <div className="contact-details">
                        <div className="contact-item">
                            <span className="contact-label">Email:</span>
                            <a href="mailto:Contact@TripLens.com" className="contact-link">Contact@TripLens.com</a>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Call:</span>
                            <a href="tel:+919021361730" className="contact-link">+91 90213 61730</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
