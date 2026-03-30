import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBusSide, faUser, faTicket, faMagnifyingGlass, faRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';

import './Profile.css';

function Profile() {
    const [user, setUser] = useState({});
    const [isEdit, setIsEdit] = useState(false);

    // Initialized as empty, will be updated when user data is fetched
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');

    const Navigate = useNavigate();

    async function fetchUserProfile() {
        try {
            const result = await axios.get('http://localhost:8080/user/profile', { withCredentials: true });
            setUser(result.data.data);
        } catch (err) {
            const errStatus = err?.response?.status;
            if (errStatus === 401) {
                Navigate('/login');
            }
            console.log("Error occured while fetching user profile: ", err);
        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // 🌟 This ensures the edit form pre-fills correctly after data is fetched from the database
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAge(user.age || '');
            setGender(user.gender || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    async function handleSaveChanges(event) {
        event.preventDefault();

        const userData = {
            Name: name,
            Age: age,
            Gender: gender,
            Phone: phone
        }

        try {
            await axios.patch('http://localhost:8080/user/profile', userData, { withCredentials: true });
            fetchUserProfile(); // Re-fetch to get updated data
        } catch (err) {
            const errStatus = err?.response?.status;
            if (errStatus === 401) {
                Navigate('/login');
            }
            console.log('Error occured while changing user info: ', err);
        }

        setIsEdit(false);
    }

    async function handleLogout() {
        try {
            await axios.post('http://localhost:8080/user/logout', {}, { withCredentials: true });
            Navigate('/login');
        } catch (err) {
            console.log("Error logging out: ", err);
        }
    }

    return (
        <div className='profile-page'>
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
            
            <div className='profile-info'>
                <h1>USER-INFO</h1>
                {isEdit ? (
                    <div className='edit-container'>
                        <button onClick={() => setIsEdit(false)} className='cancel-btn'>CANCEL</button>
                        <form onSubmit={handleSaveChanges}>
                            <button type='submit' className='save-btn'>SAVE</button>
                            <div className='user-details'>
                                <div className='user-name'>
                                    <label>YOUR NAME</label><br/>
                                    <input
                                        type='text'
                                        placeholder='YOUR NAME'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className='user-age'>
                                    <label>YOUR AGE</label><br/>
                                    <input
                                        type='number'
                                        placeholder='YOUR AGE'
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>

                                <div className='user-gender'>
                                    <label>YOUR GENDER</label><br/>
                                    {/* 🌟 FIX: Updated to onChange and dynamic checked boolean */}
                                    <input 
                                        type='radio'
                                        id='Male'
                                        onChange={() => setGender('Male')}
                                        checked={gender === 'Male'}
                                    /> &nbsp;
                                    <label htmlFor='Male' id='male-label'>MALE</label> &nbsp; &nbsp; &nbsp;
                                    
                                    <input 
                                        type='radio'
                                        id='Female'
                                        onChange={() => setGender('Female')}
                                        checked={gender === 'Female'}
                                    /> &nbsp;
                                    <label htmlFor='Female' id='female-label'>FEMALE</label>
                                </div>
                            </div>
                            
                            <div className="divider">
                                <span className="divider-text">CONTACT DETAILS</span>
                            </div>

                            <div className='user-contact'>
                                <div className='user-email'>
                                    <p>EMAIL ID</p>
                                    <h3>{user.email}</h3>
                                </div>

                                <div className='user-phone'>
                                    <label>PHONE NUMBER</label><br/>
                                    <input
                                        type='number'
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => setIsEdit(true)} className='edit-btn'>EDIT</button>
                        <div className='user-details'>
                            <div className='user-name'>
                                <p>YOUR NAME</p>
                                <h3>{user.name}</h3>
                            </div>
                            
                            <div className='user-age'>
                                <p>YOUR AGE</p>
                                <h3>{user.age}</h3>
                            </div>

                            <div className='user-gender'>
                                <p>YOUR GENDER</p>
                                <h3>{user.gender}</h3>
                            </div>
                        </div>
                            
                        <div className="divider">
                            <span className="divider-text">CONTACT DETAILS</span>
                        </div>

                        <div className='user-contact'>
                            <div className='user-email'>
                                <p>EMAIL ID</p>
                                <h3>{user.email}</h3>
                            </div>
                            
                            <div className='user-phone'>
                                <p>PHONE NUMBER</p>
                                <h3>+91-{user.phone}</h3>
                            </div>
                        </div>

                        {/* 🌟 NEW: Added a dedicated Logout button at the bottom of the profile */}
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <button 
                                onClick={handleLogout} 
                                style={{
                                    backgroundColor: '#d84e55', 
                                    color: 'white', 
                                    padding: '12px 30px', 
                                    border: 'none', 
                                    borderRadius: '8px', 
                                    cursor: 'pointer', 
                                    fontWeight: 'bold',
                                    fontSize: '16px'
                                }}
                            >
                                <FontAwesomeIcon icon={faRightFromBracket} style={{marginRight: '8px'}}/> 
                                LOGOUT
                            </button>
                        </div>
                    </div>
                )} 
            </div>
        </div>
    )
}

export default Profile;