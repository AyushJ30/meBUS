import React, {useState, useRef} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faPaperPlane, faAddressBook, faCalendar, faVenusMars, faAddressCard, faUnlock} from '@fortawesome/free-solid-svg-icons';

import './Signup.css';

function Signup(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState(0);
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('');
    const [pass, setPass] = useState('');
    const [cnfrm, setCnfrm] = useState('');
    const [file, setFile] = useState(null);

    const emailRef = useRef();
    const cnfrmRef = useRef();
    const missRef = useRef();

    const Navigate = useNavigate();

    async function handleSignup(event){
        event.preventDefault();

        const signupData = new FormData();

        signupData.append('Name', name);
        signupData.append('Email', email);
        signupData.append('Phone', phone);
        signupData.append('Age', age);
        signupData.append('Gender', gender);
        signupData.append('Password', pass);
        signupData.append('File', file);

        if(pass === cnfrm){
            try{
                const response = await axios.post('http://localhost:8080/signup', signupData);

                if(!(response.data.data)){
                    missRef.current.style.display = 'block';
                    cnfrmRef.current.style.display = 'none';
                    emailRef.current.style.display = 'none';
                } else{
                    Navigate('/login');
                }
                    

            } catch(err){
                const errStatus = err.response.status;

                if(errStatus === 400){
                    missRef.current.style.display = 'block';
                    cnfrmRef.current.style.display = 'none';
                    emailRef.current.style.display = 'none';
                } else if(errStatus === 406){
                    missRef.current.style.display = 'none';
                    cnfrmRef.current.style.display = 'block';
                    emailRef.current.style.display = 'none';
                }

                console.log('Error occured while signing-up wohooo: ', err.message);
            }
        } else{
            cnfrmRef.current.style.display = 'block';
            emailRef.current.style.display = 'none';
            missRef.current.style.display = 'none';
        }
        
    }

    function handleNavigateLogin(){
        Navigate('/login');
    }

    return(
        <div className='signup-container'>
            <form onSubmit={handleSignup} encType="multipart/form-data" className='signup-form'>

                <div className='signup-head'>
                    <h2>Sign Up</h2>
                </div>

                <h3 ref={missRef} style={{display: 'none'}}>Error: Missing Field(s)</h3>

                <label>Name</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faUser} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='text'
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                    className='signup-input'
                    />
                </div>

                <label>Email</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faPaperPlane} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='text'
                    placeholder="Enter Your Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className='signup-input'
                    />
                </div>
                <p ref={emailRef} style={{display: 'none'}}>Error: Enter Proper Email</p>

                <label>Phone No.</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faAddressBook} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='number'
                    placeholder="Enter Your Phone Number"
                    onChange={(e) => setPhone(e.target.value)}
                    className='signup-input'
                    />
                </div>

                <label>Age</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faCalendar} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='number'
                    placeholder="Enter Your Age"
                    onChange={(e) => setAge(e.target.value)}
                    className='signup-input'
                    />
                </div>

                <label>Gender</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faVenusMars} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='text'
                    placeholder="Enter Your Gender"
                    onChange={(e) => setGender(e.target.value)}
                    className='signup-input'
                    />
                </div>

                <label>Password</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faUnlock} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='password'
                    placeholder="Enter Your Password"
                    onChange={(e) => setPass(e.target.value)}
                    className='signup-input'
                    />
                </div>

                <label>Confirm Password</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faUnlock} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='password'
                    placeholder="Re-Enter Your Password"
                    onChange={(e) => setCnfrm(e.target.value)}
                    className='signup-input'
                    />
                </div>
                <p ref={cnfrmRef} style={{display: 'none'}}>Error: Password Mismatch</p>

                <label>Profile Picture</label>
                <div className='signup-icons'>
                    <FontAwesomeIcon icon={faAddressCard} style={{color: 'rgb(255, 255, 255)'}} className='signup-icon'/>
                    <input
                    type='file'
                    accept = 'image/png, image/jpeg, image/jpg'
                    onChange={(e) => setFile(e.target.files[0])}
                    className='signup-input'
                    />
                </div>

                <button type='submit' className='signup-btn'>Sign Up</button>

                <div className='login'>
                    <p>Already a User</p>
                    <button onClick={handleNavigateLogin}>Login</button>
                </div>
            </form>
        </div>
    )
}

export default Signup;