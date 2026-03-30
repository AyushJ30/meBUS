import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBusSide, faUser, faPersonWalkingDashedLineArrowRight, 
    faPersonWalkingArrowRight, faCalendarDays, faMagnifyingGlass, faTicket, 
    faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';

// Import react-datepicker for a fully stylable calendar
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Footer from './Footer/Footer.jsx';
import './Home.css';

function Home() {
    const [origin, setOrigin] = useState([]);
    const [dest, setDest] = useState([]);
    const [originID, setOriginID] = useState();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [startDate, setStartDate] = useState(new Date());

    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);

    const Navigate = useNavigate();
    
    const originRef = useRef();
    const destRef = useRef();

    async function fetchOriginCities() {
        try {
            const result = await axios.get('http://localhost:8080/location/from', { withCredentials: true });
            setOrigin(result.data.data);
        } catch (err) {
            if (err.response?.status === 401) Navigate('/login');
            console.log('Error fetching Origin Cities: ', err);
        }
    }

    async function handleLogout() {
        try {
            await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
            Navigate('/login');
        } catch (err) {
            console.log("Error logging out: ", err);
        }
    }

    async function fetchDestinationCities() {
        if (!originID) return;
        try {
            const result = await axios.get(`http://localhost:8080/location/to/${originID}`, { withCredentials: true });
            setDest(result.data.data);
        } catch (err) {
            if (err.response?.status === 401) Navigate('/login');
            console.log('Error fetching Destination Cities: ', err);
        }
    }

    useEffect(() => {
        fetchOriginCities();

        const handleClickOutside = (event) => {
            if (originRef.current && !originRef.current.contains(event.target)) {
                setShowOriginDropdown(false);
            }
            if (destRef.current && !destRef.current.contains(event.target)) {
                setShowDestDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetchDestinationCities();
    }, [originID]);

    const handleOriginSelect = (city) => {
        setFrom(city.name);
        setOriginID(city.id);
        setShowOriginDropdown(false);
        setTo(""); // Reset destination when origin changes
    };

    const handleDestSelect = (city) => {
        setTo(city.name);
        setShowDestDropdown(false);
    };

    const handleFindBus = (event) => {
        event.preventDefault();
        const formattedDate = startDate.toISOString().split('T')[0];
        Navigate('/buses', { state: { From: from, To: to, Start: formattedDate } });
    };

    return (
        <div className='home-container'>
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

            <div className='home-body'>
                <div className='home-form-container'>
                    <form onSubmit={handleFindBus} className='home-form'>
                        <div className='form-selectors'>
                            
                            <div className='from' ref={originRef}>
                                <FontAwesomeIcon icon={faPersonWalkingDashedLineArrowRight} className='from-icon' />
                                <div className='input' onClick={() => setShowOriginDropdown(!showOriginDropdown)}>
                                    <label>From</label>
                                    <div className={`custom-select-trigger ${from ? 'selected' : ''}`}>
                                        {from || "Select City"}
                                    </div>
                                    
                                    {showOriginDropdown && (
                                        <ul className='custom-options'>
                                            {origin.map((city) => (
                                                <li key={city.id} onClick={() => handleOriginSelect(city)}>
                                                    {city.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className='to' ref={destRef}>
                                <FontAwesomeIcon icon={faPersonWalkingArrowRight} className='to-icon'/> 
                                <div className='input' onClick={() => setShowDestDropdown(!showDestDropdown)}>
                                    <label>To</label>
                                    <div className={`custom-select-trigger ${to ? 'selected' : ''}`}>
                                        {to || "Select City"}
                                    </div>
                                    
                                    {showDestDropdown && (
                                        <ul className='custom-options'>
                                            {dest.length > 0 ? (
                                                dest.map((city) => (
                                                    <li key={city.id} onClick={() => handleDestSelect(city)}>
                                                        {city.name}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="no-options">Select origin first</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            
                            <div className='date'>
                                <FontAwesomeIcon icon={faCalendarDays} className='date-icon'/>
                                <div className='input'>
                                    <label>Date</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()} // Prevent past dates
                                        className="mebus-datepicker-input"
                                        calendarClassName="mebus-calendar"
                                    />
                                </div>
                            </div>
                        </div>

                        <button type='submit' className='buses-btn' disabled={!from || !to || !startDate}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} /> Find Buses
                        </button>
                    </form>
                </div>

                <div className='home-info'>
                    <div className='grid-box'>
                        <div className='slogan'>
                            <p className='slogan-text'>Hop on, stress off</p>
                            <h3>Welcome to <span>meBUS <FontAwesomeIcon icon={faBusSide} /></span><br/> Your Journey Starts Here</h3>
                            <p className='welcome-text'>Whether you are heading home for the holidays, embarking on a weekend getaway, or traveling for business, meBus is your trusted partner on the road. We are more than just a ticketing platform; we are a dedicated team of travel enthusiasts committed to making your bus journeys seamless, affordable, and safe from start to finish. By partnering with top-rated bus operators across the country, we bring thousands of routes directly to your fingertips. Sit back, relax, and let us handle the ride.</p>
                        </div>
                        <div className='bus'></div>
                        <div className='info-chooseus'>
                            <div className='first ban'><div className='ban-back'><span>Extensive Route Network:</span> From bustling metro cities to quiet hometowns.</div></div>
                            <div className='second ban'><div className='ban-back'><span>Transparent Pricing:</span> What you see is what you pay. We guarantee the best prices.</div></div>
                            <div className='third ban'><div className='ban-back'><span>Verified Operators:</span> Your safety is our priority. We only partner with highly-rated...</div></div>
                            <div className='forth ban'><div className='ban-back'><span>24/7 Support:</span> Travel plans can change. Our dedicated support team is available.</div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='home-book'>
                <h3>How to Book Your Ticket Online Using <span>meBUS <FontAwesomeIcon icon={faBusSide} /></span></h3>
                <p>Booking your next trip is incredibly easy and takes less than two minutes. Just follow these simple steps:</p>
                <ol>
                    <li><span>Search Your Route:</span> Enter your starting city, destination, and travel date.</li>
                    <li><span>Select Your Ride:</span> Compare buses based on price, departure time, and operator ratings.</li>
                    <li><span>Pick Your Seat:</span> Use our interactive seating chart to choose your favorite spot.</li>
                    <li><span>Secure Checkout:</span> Complete your payment using our safe gateway.</li>
                    <li><span>Pack Your Bags:</span> Receive your M-ticket via email instantly!</li>
                </ol>
            </div>

            <div className='home-footer'>
                <Footer/>
            </div>
        </div>
    );
}

export default Home;