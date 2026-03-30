import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router';
import axios from 'axios';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faBusSide, faUser, faTicket, faMagnifyingGlass, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import './Booking.css';

import SelectSeats from './Nav-Pages/SelectSeats.jsx';
import BoardDropPoint from './Nav-Pages/BoardDropPoint.jsx';
import PassengerInfo from './Nav-Pages/PassengerInfo.jsx';
import Payment from './Nav-Pages/Payment.jsx';
import Footer from '../Home/Footer/Footer.jsx';


function Booking(){

    const [bus, setBus] = useState([]);

    const [boards, setBoards] = useState([]);
    const [drops, setDrops] = useState([]);

    const [activePage, setActivePage] = useState(1);

    const [selectedSeats, setSelectedSeats] = useState([]);

    const [boarding, setBoarding] = useState();
    const [dropping, setDropping] = useState();

    const [passenger, setPassenger] = useState([]);
    const [cancel, setCancel] = useState(false);
    const [insure, setInsure] = useState(false);

    const Navigate = useNavigate();
    const Location = useLocation();

    const data = Location.state || {};

    async function fetchBusDetails(){
        try{
            const result = await axios.get(`http://localhost:8080/bus/${data.ID}`, {withCredentials: true});
            setBus(result.data.data);
        } catch(err){
            
            const errStatus = err.response.status;

            if(errStatus === 401){
                Navigate('/login');
            }

            console.log('Error occured while fetching bus details: ', err);
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

    async function fetchBoardingPoints(){
        try{
            const result = await axios.get(`http://localhost:8080/booking/board/${bus.origin}`, {withCredentials: true});
            setBoards(result.data.data);
        } catch(err){
            console.log("Error occured while fetching Boarding points: ", err);
        }
    }

    async function fetchDropPoints(){
        try{
            const result = await axios.get(`http://localhost:8080/booking/drop/${bus.destination}`, {withCredentials: true});
            setDrops(result.data.data);
        } catch(err){  
            console.log("Error occured while fetching Dropping Points: ", err);
        }
    }

    useEffect(() => {
        fetchBusDetails();
    }, []);

    useEffect(() => {
        fetchBoardingPoints();
        fetchDropPoints();
    }, [bus]);

    function renderActiveComponents(){
        switch(activePage){
            case 1:
                return <SelectSeats
                        bus={bus}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                        TravelDate={data.Start}
                        onNextStep={() => {
                            setActivePage(2);
                        }}
                        />;
            
            case 2:
                return <BoardDropPoint
                        boards={boards}
                        drops={drops}
                        onNextStep={(boarding, dropping) => {
                            setBoarding(boarding);
                            setDropping(dropping);
                            setActivePage(3);
                        }}
                        />;

            case 3:
                return <PassengerInfo
                        bus={bus}
                        seats={selectedSeats}
                        boarding={boarding}
                        dropping={dropping}
                        onNextStep={(passengerData, cancel, insure) => {
                            setPassenger(passengerData);
                            setCancel(cancel);
                            setInsure(insure);
                            setActivePage(4);
                        }}
                        />;

            case 4:
                return <Payment
                        bus={bus}
                        seats={selectedSeats}
                        cancel={cancel}
                        insure={insure}
                        onPaymentSuccess={(totalAmount) => {
                            submitFinalBooking(totalAmount)
                        }}
                        />

            default: 
                return <SelectSeats
                        bus={bus}
                        selectedSeats={selectedSeats}
                        setSelectedSeats={setSelectedSeats}
                        TravelDate={data.Start}
                        onNextStep={() => {
                            setActivePage(2);
                        }}
                        />;
        }
    }

    async function submitFinalBooking(totalAmountPaid){
        try {
            const generatedPNR = Math.random().toString(36).substring(2,10).toUpperCase();
            let contactEmail = ""; 

            for (let i = 0; i < passenger.length; i++) {
                const pass = passenger[i];
                
                if (i === 0) contactEmail = pass.email; 

                const passengerResponse = await axios.post(`http://localhost:8080/booking/passenger/${bus.id}`, {
                    Name: pass.name, Age: pass.age, Gender: pass.gender,
                    Email: pass.email, Phone: pass.phone, Board: pass.board,
                    Drop: pass.drop, SeatNumber: pass.seatNumber,
                }, {withCredentials: true});

                const passengerId = passengerResponse.data.data.id;

                await axios.post(`http://localhost:8080/booking/pay/${bus.id}`, {
                    PassengerID: passengerId,
                    Cancel: cancel,
                    Insure: insure,
                    TotalAmount: totalAmountPaid, 
                    PNR: generatedPNR,
                    TravelDate: data.Start,
                }, {withCredentials: true});
            }

            if (contactEmail) {
                await axios.post(`http://localhost:8080/booking/send-ticket-email`, {
                    PNR: generatedPNR,
                    Email: contactEmail
                }, {withCredentials: true});
            }

            Navigate('/confirmation', { 
                state: {
                    bus: bus,
                    passengers: passenger,
                    totalAmount: totalAmountPaid,
                    pnr: generatedPNR,
                    travelDate: data.Start 
                }
            });

        } catch(err) {
            const errStatus = err?.response?.status;
            if(errStatus === 409){
                console.log("Conflict: Could not create passenger. Please Try Again");
                Navigate('/buses');
            } else if(errStatus === 401){
                Navigate('/login');
            }
            console.log("Error during Booking Process: ", err);
        }
    }

    return(
        <div className='booking-container'>

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

            <div className='booking-navbar'>
                <button 
                className= {`${activePage === 1 ? 'active' : ''}`}
                onClick={() => setActivePage(1)}>
                    1. Select Seats
                </button>
                
                <button 
                className= {`${activePage === 2 ? 'active' : ''}`}
                onClick={() => setActivePage(2)}
                disabled={selectedSeats.length === 0}
                >
                    2. Board/Drop Point
                </button>
                
                <button 
                className= {`${activePage === 3 ? 'active' : ''}`}
                onClick={() => setActivePage(3)}
                disabled={selectedSeats.length === 0 || !boarding || !dropping}
                >
                    3. Passenger Info
                </button>
            </div>

            <div className="booking-content">
                {renderActiveComponents()}
            </div>

            <div className='home-footer'>
                <Footer/>
            </div>
        </div>
    );
} 

export default Booking;