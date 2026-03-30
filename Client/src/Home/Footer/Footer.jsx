import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusSide, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import './Footer.css'; // We will create this next

function Footer() {
    const Navigate = useNavigate();

    return (
        <div className='site-footer'>
            <div className='footer-content'>
                
                <div className='footer-brand'>
                    <h2 onClick={() => Navigate('/')} className='footer-logo'>
                        meBUS <FontAwesomeIcon icon={faBusSide} className='footer-icon' />
                    </h2>
                    <p className='footer-slogan'>Hop on, stress off.</p>
                    <p className='footer-desc'>
                        Your trusted partner for safe, affordable, and seamless bus journeys across the country. Sit back, relax, and let us handle the ride.
                    </p>
                </div>

                <div className='footer-links'>
                    <h3>Quick Links</h3>
                    <ul>
                        <li onClick={() => Navigate('/')}>Home</li>
                        <li onClick={() => Navigate('/buses')}>Find Buses</li>
                        <li onClick={() => Navigate('/profile')}>My Account</li>
                        <li>Help & Support</li>
                    </ul>
                </div>

                <div className='footer-contact'>
                    <h3>Contact Us</h3>
                    <div className='contact-item'>
                        <FontAwesomeIcon icon={faLocationDot} className='contact-icon' />
                        <p>123 Transit Hub, New Delhi, India</p>
                    </div>
                    <div className='contact-item'>
                        <FontAwesomeIcon icon={faPhone} className='contact-icon' />
                        <p>+91 1800-123-4567</p>
                    </div>
                    <div className='contact-item'>
                        <FontAwesomeIcon icon={faEnvelope} className='contact-icon' />
                        <p>support@mebus.com</p>
                    </div>
                </div>

            </div>

            <div className='footer-bottom'>
                <p>&copy; {new Date().getFullYear()} meBUS. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Footer;