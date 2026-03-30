import React, { useState } from 'react';
import './BoardDropPoint.css';

function BoardDropPoint({ boards, drops, onNextStep }) {
    const [boarding, setBoarding] = useState('');
    const [dropping, setDropping] = useState('');

    return (
        <div className='point-container'>
            <div className='point-list'>
                
                {/* Boarding Section */}
                <div className='board-container'>
                    <div className='point-head'>
                        <h3>Boarding points</h3>
                        <p>{boarding || "Select Boarding Point"}</p>
                    </div>
                    <form onChange={(e) => setBoarding(e.target.value)}>
                        {boards.map((board, index) => (
                            <label
                                key={`board-${index}`}
                                htmlFor={`board-${index}`}
                                className={`point-row ${boarding === board.point ? 'selected' : ''}`}
                            >
                                <div className="point-info">
                                    <div className="point-text">
                                        <span className="point-main">{board.point}</span>
                                        {board.subtext && <span className="point-sub">{board.subtext}</span>}
                                    </div>
                                </div>
                                <div className="radio-wrapper">
                                    <input
                                        type='radio'
                                        value={board.point}
                                        name='board'
                                        id={`board-${index}`}
                                    />
                                    <span className="custom-radio"></span>
                                </div>
                            </label>
                        ))}
                    </form>
                </div>

                {/* Dropping Section */}
                <div className='drop-container'>
                    <div className='point-head'>
                        <h3>Dropping points</h3>
                        <p>{dropping || "Select Dropping Point"}</p>
                    </div>
                    <form onChange={(e) => setDropping(e.target.value)}>
                        {drops.map((drop, index) => (
                            <label
                                key={`drop-${index}`}
                                htmlFor={`drop-${index}`}
                                className={`point-row ${dropping === drop.point ? 'selected' : ''}`}
                            >
                                <div className="point-info">
                                    <div className="point-text">
                                        <span className="point-main">{drop.point}</span>
                                        {drop.subtext && <span className="point-sub">{drop.subtext}</span>}
                                    </div>
                                </div>
                                <div className="radio-wrapper">
                                    <input
                                        type='radio'
                                        value={drop.point}
                                        name='drop'
                                        id={`drop-${index}`}
                                    />
                                    <span className="custom-radio"></span>
                                </div>
                            </label>
                        ))}
                    </form>
                </div>
            </div>
            
            <div className='btn-container'>
                <button 
                    className="proceed-btn"
                    disabled={!boarding || !dropping} 
                    onClick={() => onNextStep(boarding, dropping)}
                >
                    Proceed to Add Passenger Info
                </button>
            </div>
        </div>
    );
}

export default BoardDropPoint;