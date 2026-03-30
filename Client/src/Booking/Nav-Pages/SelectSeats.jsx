import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SelectSeats.css'; 

function SelectSeats({ bus, selectedSeats, setSelectedSeats, TravelDate, onNextStep }) {
    const [realBookedSeats, setRealBookedSeats] = useState([]);

    useEffect(() => {
        async function fetchBookedSeats() {
            if (!bus || !bus.id) return;
            try {
                const response = await axios.get(`http://localhost:8080/bus/${bus.id}/seats?date=${TravelDate}`, { withCredentials: true });
                const rawSeats = response.data.data || [];
                const safeSeatNumbers = rawSeats.map(seat => parseInt(seat, 10));
                setRealBookedSeats(safeSeatNumbers); 
            } catch (error) {
                console.log("Error fetching booked seats from database:", error);
            }
        }
        fetchBookedSeats();
    }, [bus, TravelDate]);

    if (!bus || Object.keys(bus).length === 0) {
        return <div className="loading-seats">Loading seat layout...</div>;
    }

    // 🌟 THE FIX: Calculate the true available seats right here!
    const dynamicAvlSeats = bus.totalSeats - realBookedSeats.length;

    const handleSeatClick = (seatNumber) => {
        if (realBookedSeats.includes(seatNumber)){
            return;
        } 

        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
        } else {
            // 🌟 Use the dynamic count for your limit logic
            if (selectedSeats.length < dynamicAvlSeats) {
                setSelectedSeats([...selectedSeats, seatNumber]);
            } else {
                alert(`You cannot select more than the available ${dynamicAvlSeats} seats.`);
            }
        }
    };

    const allSeats = Array.from({ length: bus.totalSeats }, (_, i) => i + 1);

    return (
        <div className="select-seats-container">
            <h3>Select Your Seats</h3>
            
            <div className="bus-info-bar">
                <span>Operator: <strong>{bus.name}</strong></span>
                <span>Total Seats: <strong>{bus.totalSeats}</strong></span>
                {/* 🌟 Display the dynamically calculated seats */}
                <span>Available: <strong>{dynamicAvlSeats}</strong></span>
                <span>Fare per seat: <strong>₹{bus.finalPrice}</strong></span>
            </div>

            <div className="seat-grid-wrapper">
                <div className="driver-cabin">Steering</div>
                
                <div className="seat-grid">
                    {allSeats.map((seatNumber) => {
                        const isBooked = realBookedSeats.includes(seatNumber);
                        const isSelected = selectedSeats.includes(seatNumber);

                        let seatClass = 'seat-available';
                        if (isBooked) seatClass = 'seat-booked';
                        else if (isSelected) seatClass = 'seat-selected';

                        return (
                            <div 
                                key={seatNumber} 
                                className={`seat ${seatClass}`}
                                onClick={() => handleSeatClick(seatNumber)}
                                title={isBooked ? 'Seat Booked' : `Seat ${seatNumber}`}
                            >
                                {seatNumber}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="seat-summary">
                <p>Selected Seats: <strong>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</strong></p>
                <p>Total Fare: <strong>₹{selectedSeats.length * bus.finalPrice}</strong></p>
                
                <button 
                    className="proceed-btn"
                    onClick={onNextStep}
                    disabled={selectedSeats.length === 0}
                >
                    Proceed to Boarding Point
                </button>
            </div>
        </div>
    );
}

export default SelectSeats;