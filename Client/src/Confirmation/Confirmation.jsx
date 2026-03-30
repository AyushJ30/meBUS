import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import html2pdf from 'html2pdf.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faDownload, faHome, faBusSide, faLocationDot } from '@fortawesome/free-solid-svg-icons';

// Import the time formatting utilities
import { formatTime, calculateArrival } from '../utils/timeUtils';

import './Confirmation.css';

function ConfirmationPage() {
    const Location = useLocation();
    const Navigate = useNavigate();
    const ticketRef = useRef();

    const bookingData = Location.state;

    if (!bookingData) {
        return (
            <div className="error-container">
                <h2>No booking data found!</h2>
                <button onClick={() => Navigate('/')}>Go to Home</button>
            </div>
        );
    }

    const { bus, passengers, totalAmount, pnr , travelDate} = bookingData;

    const handleDownloadPDF = () => {
        const element = ticketRef.current;
        const options = {
            margin:       0.5,
            filename:     `meBus_Ticket_${pnr}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save();
    };

    return (
        <div className="confirmation-wrapper">
            <div className="success-header">
                <FontAwesomeIcon icon={faCircleCheck} className="success-icon" />
                <h2>Booking Confirmed!</h2>
                <p>Your tickets have been successfully booked. Have a great journey!</p>
            </div>

            {/* This is the container that gets converted to PDF */}
            <div className="ticket-container" ref={ticketRef}>
                <div className="ticket-header">
                    <h2>meBUS <FontAwesomeIcon icon={faBusSide} /></h2>
                    <span className="pnr-badge">PNR: {pnr}</span>
                </div>

                <div className="ticket-body">
                    <div className="route-info">
                        <div className="city">
                            <h3>{bus.origin}</h3>
                            <p>Boarding: {passengers[0].board}</p>
                            {/* Replaced old format logic with the new helper */}
                            <p className="time-subtext">Departure: <strong>{formatTime(bus.start)}</strong></p>
                        </div>
                        <div className="route-arrow">
                            <span className="line"></span>
                            <FontAwesomeIcon icon={faBusSide} className="bus-icon-small" />
                            <span className="line"></span>
                        </div>
                        <div className="city">
                            <h3>{bus.destination}</h3>
                            <p>Dropping: {passengers[0].drop}</p>
                            {/* Replaced bus.end with the calculateArrival helper */}
                            <p className="time-subtext">Arrival: <strong>{calculateArrival(bus.start, bus.duration)}</strong></p>
                        </div>
                    </div>

                    <div className="bus-details-row">
                        <div className="detail-box">
                            <span>Bus Name</span>
                            <strong>{bus.name}</strong>
                        </div>
                        <div className="detail-box">
                            <span>Date of Travel</span>
                            <strong>{travelDate}</strong>
                        </div>
                        <div className="detail-box">
                            <span>Date of Booking</span>
                            <strong>{new Date().toLocaleDateString()}</strong>
                        </div>
                        <div className="detail-box">
                            <span>Total Amount</span>
                            <strong>₹{totalAmount}</strong>
                        </div>
                    </div>

                    <div className="passenger-section">
                        <h3>Passenger Details</h3>
                        <table className="passenger-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Seat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {passengers.map((pass, index) => (
                                    <tr key={index}>
                                        <td>{pass.name}</td>
                                        <td>{pass.age}</td>
                                        <td>{pass.gender}</td>
                                        <td>{pass.seatNumber}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="ticket-footer">
                    <p>Please carry a valid ID proof along with this digital ticket.</p>
                </div>
            </div>

            <div className="action-buttons">
                <button className="download-btn" onClick={handleDownloadPDF}>
                    <FontAwesomeIcon icon={faDownload} /> Download Ticket PDF
                </button>
                <button className="home-btn-alt" onClick={() => Navigate('/')}>
                    <FontAwesomeIcon icon={faHome} /> Back to Home
                </button>
            </div>
        </div>
    );
}

export default ConfirmationPage;