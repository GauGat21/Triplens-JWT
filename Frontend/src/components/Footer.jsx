import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-logo">Triplens</div>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact</a>
                </div>
                <div className="copyright">
                    © {new Date().getFullYear()} Triplens. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
