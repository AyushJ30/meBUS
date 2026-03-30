import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faBan, faDownload, faArrowRight, faBusSide, faUser, faMagnifyingGlass, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

// Import your new time utility function
import { formatTime } from '../utils/timeUtils'; 

import './UserBookings.css';

function UserBookings() {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isLoading, setIsLoading] = useState(true);

    const Navigate = useNavigate();

    useEffect(() => {
        fetchUserBookings();
    }, []);

    function navigateProfilePage(){
        Navigate('/profile');
    }

    function navigateHomePage(){
        Navigate('/');
    }

    function navigateUserBookings(){
        Navigate('/profile/bookings');
    }

    const fetchUserBookings = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/booking', { withCredentials: true });
            setBookings(response.data.data || []);
        } catch (error) {
            console.log("Error fetching bookings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    async function handleLogout() {
        try {
            await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
            Navigate('/login');
        } catch (err) {
            console.log("Error logging out: ", err);
        }
    }

    async function handleCancelBooking(bookingId){
        const confirmCancel = window.confirm("Are you sure you want to cancel this ticket? Cancellation charges may apply.");
        if (!confirmCancel) return;

        try {
            await axios.post(`http://localhost:8080/booking/cancel/${bookingId}`, {}, { withCredentials: true });
            fetchUserBookings(); // Refresh the list after successful cancellation
        } catch (error) {
            console.log("Error cancelling booking:", error);
        }
    };
    
    const upcomingBookings = bookings.filter(b => b.status === 'Upcoming');
    const pastBookings = bookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

    const renderTable = (data, isPast) => {
        if (data.length === 0) {
            return (
                <div className="empty-bookings-state">
                    <FontAwesomeIcon icon={faTicket} className="empty-icon" />
                    <h3>No {isPast ? 'past' : 'upcoming'} bookings found.</h3>
                    <p>When you book a trip, it will show up here.</p>
                </div>
            );
        }

        return (
            <div>
                <div className="table-responsive">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Journey</th>
                                <th>Date & Time</th>
                                <th>Name</th>
                                <th>Seats(Seat No.)</th>
                                <th>Total Fare</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        <div className="route-cell">
                                            <div className="route-cities">
                                                <span className="city-name">{booking.origin}</span>
                                                <FontAwesomeIcon icon={faArrowRight} className="route-arrow-icon" />
                                                <span className="city-name">{booking.destination}</span>
                                            </div>
                                            <span className="pnr-badge">PNR: {booking.pnr}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{booking.date}</strong>
                                        <br />
                                        {/* Using formatTime to display the 12-hour AM/PM format cleanly */}
                                        <span className="sub-text">
                                            {formatTime(booking.time || booking.start)}
                                        </span>
                                    </td>
                                    <td>{booking.operatorName}</td>
                                    <td>
                                        <strong>{booking.seats?.length || 1}</strong> 
                                        <span className="sub-text"> ({booking.seats ? booking.seats.join(', ') : booking.seatNumber})</span>
                                    </td>
                                    <td>₹{booking.totalAmount}</td>
                                    <td>
                                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-cell">
                                            {/* Cancel button ONLY shows for Upcoming journeys */}
                                            {!isPast && booking.status === 'Upcoming' && (
                                                <button 
                                                    className="action-btn cancel" 
                                                    title="Cancel Ticket"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    <FontAwesomeIcon icon={faBan} /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        );
    };

    return (
        <div className='page-container'>
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
            <div className="user-bookings-container">
                <div className="bookings-header">
                    <h2>My Bookings</h2>
                    <div className="bookings-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            Upcoming Journeys
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => setActiveTab('past')}
                        >
                            Past Journeys
                        </button>
                    </div>
                </div>

                <div className="bookings-content">
                    {isLoading ? (
                        <div className="loading-state">Loading your tickets...</div>
                    ) : (
                        activeTab === 'upcoming' ? renderTable(upcomingBookings, false) : renderTable(pastBookings, true)
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserBookings;