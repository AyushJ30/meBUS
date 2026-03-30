import React, { useState } from 'react';
import './PassengerInfo.css';

function PassengerInfo({ bus, seats, boarding, dropping, onNextStep }) {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(0);
    const [cancel, setCancel] = useState(false);
    const [insure, setInsure] = useState(false);

    const [passengerDetails, setPassengerDetails] = useState({});

    const handlePassengerChange = (seatNumber, field, value) => {
        setPassengerDetails(prev => ({
            ...prev, [seatNumber]: {
                ...prev[seatNumber],
                [field]: value
            }
        }));
    };

    const isFormValid = () => {
        
        if (!email.trim() || !phone) return false;

        for (const seat of seats) {
            const pass = passengerDetails[seat];
            
            if (!pass || !pass.name.trim() || !pass.age || !pass.gender) {
                return false;
            }
        }
        return true;
    };

    function handleBookingFinalization() {
        const passengersArray = seats.map(seat => ({
            name: passengerDetails[seat]?.name || '',
            age: passengerDetails[seat]?.age || '',
            gender: passengerDetails[seat]?.gender || '',
            email: email,
            phone: phone,
            busId: bus.id,
            board: boarding,
            drop: dropping,
            seatNumber: seat,
        }));

        onNextStep(passengersArray, cancel, insure);
    }

    return (
        <div className='passenger-container'>
            
            {/* --- Contact Details Card --- */}
            <div className='card-box contact-container'>
                <div className="card-header">
                    <h3>Contact details</h3>
                    <p>Ticket details will be sent to</p>
                </div>
                
                <div className='input-row'>
                    <div className='input-group'>
                        <label htmlFor='phone'>Phone *</label>
                        <input
                            type='number'
                            id='phone'
                            placeholder="Enter phone number"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>
                <div className='input-row'>
                    <div className='input-group'>
                        <label htmlFor='email'>Email ID *</label>
                        <input
                            type='email'
                            id='email'
                            placeholder="Enter email ID"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- Passenger Details Card --- */}
            <div className='card-box details-container'>
                <div className="card-header">
                    <h3>Passenger details</h3>
                </div>

                {seats.map((seat, index) => (
                    <div key={index} className="passenger-entry">
                        <div className="passenger-seat-header">
                            <div className="avatar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                            </div>
                            <div className="seat-title">
                                <h4>Passenger {index + 1}</h4>
                                <span>Seat {seat}</span>
                            </div>
                        </div>

                        <div className='input-group'>
                            <label htmlFor={`name-${index}`}>Name *</label>
                            <input
                                type='text'
                                id={`name-${index}`}
                                placeholder="Name"
                                value={passengerDetails[seat]?.name || ''}
                                onChange={(e) => handlePassengerChange(seat, 'name', e.target.value)}
                            />
                        </div>

                        <div className='input-group'>
                            <label htmlFor={`age-${index}`}>Age *</label>
                            <input
                                type='number'
                                id={`age-${index}`}
                                placeholder="Age"
                                value={passengerDetails[seat]?.age || ''}
                                onChange={(e) => handlePassengerChange(seat, 'age', e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Gender *</label>
                            <div className='gender-container'>
                                <label 
                                    htmlFor={`Male-${index}`} 
                                    className={`gender-pill ${passengerDetails[seat]?.gender === 'Male' ? 'selected' : ''}`}
                                >
                                    <span>Male</span>
                                    <input
                                        type='radio'
                                        name={`Gender-${index}`}
                                        id={`Male-${index}`}
                                        value="Male"
                                        checked={passengerDetails[seat]?.gender === 'Male'}
                                        onChange={(e) => handlePassengerChange(seat, 'gender', e.target.value)}
                                    />
                                    <span className="custom-radio"></span>
                                </label>

                                <label 
                                    htmlFor={`Female-${index}`} 
                                    className={`gender-pill ${passengerDetails[seat]?.gender === 'Female' ? 'selected' : ''}`}
                                >
                                    <span>Female</span>
                                    <input
                                        type='radio'
                                        name={`Gender-${index}`}
                                        id={`Female-${index}`}
                                        value="Female"
                                        checked={passengerDetails[seat]?.gender === 'Female'}
                                        onChange={(e) => handlePassengerChange(seat, 'gender', e.target.value)}
                                    />
                                    <span className="custom-radio"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Cancellation Card --- */}
            <div className='card-box option-card-container'>
                <div className="card-header">
                    <h3>Free Cancellation</h3>
                    <p>Valid till 6 hours prior to departure</p>
                </div>

                <div className="option-list">
                    <label htmlFor='Cancel' className={`option-row ${cancel === true ? 'selected' : ''}`}>
                        <div className="option-text">
                            <span className="option-main">Add Free Cancellation</span>
                            <span className="option-sub">₹50 per passenger</span>
                        </div>
                        <input
                            type='radio'
                            onChange={() => setCancel(true)}
                            id='Cancel'
                            name='cancellation'
                            checked={cancel === true}
                        />
                        <span className="custom-radio"></span>
                    </label>

                    <label htmlFor='no-Cancel' className={`option-row ${cancel === false ? 'selected' : ''}`}>
                        <div className="option-text">
                            <span className="option-main">Don't add Free Cancellation</span>
                        </div>
                        <input
                            type='radio'
                            onChange={() => setCancel(false)}
                            id='no-Cancel'
                            name='cancellation'
                            checked={cancel === false}
                        />
                        <span className="custom-radio"></span>
                    </label>
                </div>
            </div>

            {/* --- Insurance Card --- */}
            <div className='card-box option-card-container'>
                <div className="card-header insurance-header">
                    <h3>Travel Insurance</h3>
                    <span className="badge">₹15 per passenger</span>
                </div>

                <div className='insurance-desc'>
                    <ul>
                        <li><strong>Upto ₹5,000</strong> In the event of loss of luggage</li>
                        <li><strong>Upto ₹75,000</strong> In the event of accidental hospitalisation</li>
                        <li><strong>Upto ₹6 Lakh</strong> In case of Death/PTD/PPD</li>
                    </ul>
                </div>
            
                <div className="option-list">
                    <label htmlFor='insure' className={`option-row ${insure === true ? 'selected' : ''}`}>
                        <div className="option-text">
                            <span className="option-main">Yes, Protect my trip at ₹{15 * seats.length} ({seats.length} passenger)</span>
                        </div>
                        <input
                            type='radio'
                            name='insurance'
                            id='insure'
                            onChange={() => setInsure(true)}
                            checked={insure === true}
                        />
                        <span className="custom-radio"></span>
                    </label>

                    <label htmlFor='no-insure' className={`option-row ${insure === false ? 'selected' : ''}`}>
                        <div className="option-text">
                            <span className="option-main">No, I would like to proceed without Insurance</span>
                        </div>
                        <input
                            type='radio'
                            name='insurance'
                            id='no-insure'
                            onChange={() => setInsure(false)}
                            checked={insure === false}
                        />
                        <span className="custom-radio"></span>
                    </label>
                </div>
            </div>

            <div className='btn-container'>
                <button className="proceed-btn" onClick={handleBookingFinalization} disabled={!isFormValid()}>Proceed to Payment Page</button>
            </div>
        </div>
    );
}

export default PassengerInfo;