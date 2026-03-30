import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusSide, faUser, faTicket, faMagnifyingGlass, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Home/Footer/Footer';

// Make sure the path matches where you saved your timeUtils.js file
import { formatTime, calculateArrival } from '../utils/timeUtils'; 

import './Buses.css';

// 🌟 NEW: Extracted BusCard Component for dynamic seat calculation
function BusCard({ bus, travelDate, onBook }) {
    // Default to totalSeats while loading
    const [dynamicAvlSeats, setDynamicAvlSeats] = useState(bus.totalSeats);

    const Navigate = useNavigate();

    useEffect(() => {
        async function fetchBookedSeatsForCard() {
            if (!bus || !bus.id || !travelDate) return;
            try {
                // Fetch the booked seats for this specific bus on the searched date
                const response = await axios.get(
                    `http://localhost:8080/bus/${bus.id}/seats?date=${travelDate}`, 
                    { withCredentials: true }
                );
                const bookedSeats = response.data.data || [];
                
                // Calculate true availability!
                setDynamicAvlSeats(bus.totalSeats - bookedSeats.length);
            } catch (error) {
                console.log(`Error fetching seats for bus ${bus.id}:`, error);
            }
        }
        fetchBookedSeatsForCard();
    }, [bus.id, travelDate]);

    // Converts '04:30:00' to '4h 30m' locally for the card
    function formatDurationDisplay(durationTime) {
        if (!durationTime) return "N/A";
        const [hours, minutes] = durationTime.split(':').map(Number);
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        return `${minutes}m`;
    }

    

    return (
        <div className='bus-container'>
            <div className='bus-details'>
                <h3>{bus.name}</h3>
                <div className='bus-timings'>
                    <h3>{formatTime(bus.start)} - {calculateArrival(bus.start, bus.duration)}</h3>
                    {/* 🌟 Display the dynamically calculated seats instead of bus.avlSeats */}
                    <p>{formatDurationDisplay(bus.duration)} . <strong style={{color: '#006938'}}>{dynamicAvlSeats} Seats</strong></p>
                </div>
                <div className='bus-pricing'>
                    <p className='final-fare'><strong>₹{bus.finalPrice}</strong></p>
                    <p className='original-fare'>₹{bus.fare}</p>
                </div>
            </div>
            <div className='bus-book'>
                <button className='book-btn' onClick={() => onBook(bus.id)}>View Seats</button>
            </div>
        </div>
    );
}


function Buses() {
    const [buses, setBuses] = useState([]);
    const [sortBy, setSortBy] = useState('price-low-high');

    const Navigate = useNavigate();
    const Location = useLocation();

    const data = Location.state || {};

    async function handleLogout() {
        try {
            await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
            Navigate('/login');
        } catch (err) {
            console.log("Error logging out: ", err);
        }
    }
    
    async function fetchBuses() {
        const busData = {
            Origin: data.From,
            Destination: data.To,
            Start: data.Start
        }

        try {
            const result = await axios.post('http://localhost:8080/busfetch', busData, {withCredentials: true});
            setBuses(result.data.data);
        } catch(err) {
            const errStatus = err?.response?.status;
            if(errStatus === 401) {
                Navigate('/login');
            }
            console.log('Error occured while fetching buses on this route: ', err);
        }
    }
    
    useEffect(() => {
        fetchBuses();
    }, []);

    function handleBusBook(id) {
        Navigate('/booking', {state: {ID: id, Start: data.Start}});
    }

    const sortedBuses = [...buses].sort((a,b) => {
        if(sortBy === 'price-low-high'){
            return a.finalPrice - b.finalPrice;
        } else if(sortBy === 'price-high-low'){
            return b.finalPrice - a.finalPrice;
        } else if(sortBy === 'time-early'){
            return (a.start || "").localeCompare(b.start || ""); 
        } else if(sortBy === 'time-late'){
            return (b.start || "").localeCompare(a.start || "");
        }
        return 0;
    });

    return (
        <div className='buses-container'>
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
            
            <div className='filter-bar'>
                <h2>{buses.length} buses found</h2>
                <div className='sort'>
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={((e) => setSortBy(e.target.value))}>
                        <option value='price-low-high'>Price: Low to High</option>
                        <option value='price-high-low'>Price: High to Low</option>
                        <option value='time-early'>Departure: Earliest</option>
                        <option value='time-late'>Departure: Latest</option>
                    </select>
                </div>
            </div>

            <ul className='bus-list'>
                {sortedBuses.map((bus, index) => (
                    <li key={index}>
                        {/* 🌟 Pass the bus data and the search date to the new component */}
                        <BusCard 
                            bus={bus} 
                            travelDate={data.Start} 
                            onBook={handleBusBook} 
                        />
                    </li>
                ))}
            </ul>
            
            <div className='home-footer'>
                <Footer/>
            </div>
        </div>
    )
}

export default Buses;