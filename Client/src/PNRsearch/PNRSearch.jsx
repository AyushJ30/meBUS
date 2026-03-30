import React, { useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTicket, faBusSide, faDownload , faUser, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router';

import { formatTime, calculateArrival } from '../utils/timeUtils';

import '../Confirmation/Confirmation.css'; 
import './PNRSearch.css';

function PNRSearch() {
    const [pnr, setPnr] = useState("");
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const Navigate = useNavigate();
    
    const ticketRef = useRef();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (pnr.length < 4) return;
        setLoading(true);
        setError("");
        setBooking(null);

        try {
            const response = await axios.get(`http://localhost:8080/pnr/${pnr}`, { withCredentials: true });
            if (response.data.data) {
                setBooking(response.data.data);
            } else {
                setError("No booking found with this PNR.");
            }
        } catch (err) {
            // Using the custom error message if it's an old ticket
            const errorMsg = err.response?.data?.message || "Unable to find ticket. Please check the PNR.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const element = ticketRef.current;
        const options = {
            margin:       0.5,
            filename:     `meBus_Ticket_${booking.pnr}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save();
    };
    async function handleLogout() {
        try {
            await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
            Navigate('/login');
        } catch (err) {
            console.log("Error logging out: ", err);
        }
    }

    return (
        <div className='search-container'>
            <div className='home-header'>
                <button onClick={() => Navigate('/')} className='home-btn'>
                    meBUS <FontAwesomeIcon icon={faBusSide} className='home-icon' />
                </button>
                <div className='profile-btns'>
                    <button onClick={() => Navigate('/search')} className='profile-btn'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} /><span>PNR Search</span>
                    </button>
                    <button onClick={() => Navigate('/profile/bookings')} className='profile-btn'>
                        <FontAwesomeIcon icon={faTicket} /><span>Bookings</span>
                    </button>
                    <button onClick={() => Navigate('/profile')} className='profile-btn'>
                        <FontAwesomeIcon icon={faUser} /><span>Account</span>
                    </button>
                    
                    <button onClick={handleLogout} className='profile-btn logout-header-btn' style={{color: '#d84e55'}}>
                        <FontAwesomeIcon icon={faRightFromBracket} /><span>Logout</span>
                    </button>
                </div>
            </div>
            <div className="pnr-search-wrapper">
                <div className="search-section">
                    <h2>Manage Your Booking</h2>
                    <form onSubmit={handleSearch} className="pnr-form">
                        <div className="search-input-wrapper">
                            <FontAwesomeIcon icon={faTicket} className="input-icon" />
                            <input 
                                type="text" 
                                placeholder="Enter 8-digit PNR" 
                                value={pnr} 
                                onChange={(e) => setPnr(e.target.value.toUpperCase())}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="search-btn">
                            {loading ? "Checking..." : <><FontAwesomeIcon icon={faMagnifyingGlass} /> Search Ticket</>}
                        </button>
                    </form>
                    {error && <p className="error-msg">{error}</p>}
                </div>

                {booking && (
                    <div className="ticket-display-area">
                        {/* The Downloadable Ticket Container (Exact match to Confirmation.jsx) */}
                        <div className="ticket-container" ref={ticketRef}>
                            <div className="ticket-header">
                                <h2>meBUS <FontAwesomeIcon icon={faBusSide} /></h2>
                                <span className="pnr-badge">PNR: {booking.pnr}</span>
                            </div>

                            <div className="ticket-body">
                                <div className="route-info">
                                    <div className="city">
                                        <h3>{booking.bus.origin}</h3>
                                        <p>Boarding: {booking.board}</p>
                                        <p className="time-subtext">Departure: <strong>{formatTime(booking.bus.start)}</strong></p>
                                    </div>
                                    <div className="route-arrow">
                                        <span className="line"></span>
                                        <FontAwesomeIcon icon={faBusSide} className="bus-icon-small" />
                                        <span className="line"></span>
                                    </div>
                                    <div className="city">
                                        <h3>{booking.bus.destination}</h3>
                                        <p>Dropping: {booking.drop}</p>
                                        <p className="time-subtext">Arrival: <strong>{calculateArrival(booking.bus.start, booking.bus.duration)}</strong></p>
                                    </div>
                                </div>

                                <div className="bus-details-row">
                                    <div className="detail-box">
                                        <span>Bus Name</span>
                                        <strong>{booking.bus.name}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span>Travel Date</span>
                                        <strong>{new Date(booking.travelDate).toLocaleDateString()}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span>Date of Booking</span>
                                        <strong>{new Date(booking.createdAt).toLocaleDateString()}</strong>
                                    </div>
                                    <div className="detail-box">
                                        <span>Total Amount</span>
                                        <strong>₹{booking.totalAmount}</strong>
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
                                            {booking.passengers.map((pass, index) => (
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

                        <div className="action-buttons-center">
                            <button className="download-btn" onClick={handleDownloadPDF}>
                                <FontAwesomeIcon icon={faDownload} /> Download Ticket PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PNRSearch;