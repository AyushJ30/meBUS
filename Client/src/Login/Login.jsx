import React, {useState, useRef} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';

import './Login.css';

function Login(){

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const Navigate = useNavigate();

    const invRef = useRef();

    async function handleLogin(event){
        event.preventDefault();

        const loginData = {
            Email: email,
            Password: pass
        };

        try{
            const response = await axios.post('http://localhost:8080/login', loginData, {withCredentials: true});

            if(!(response.data === null)){
                invRef.current.style.display = 'none';
                Navigate('/');
            }
        } catch(err){
            const errStatus = err.response.status;

            if(errStatus === 400 || errStatus === 406){
                invRef.current.style.display = 'block';
            }
            console.log('Error occured while trying to login: ', err);
        }

    }
 
    function handleNavigateSignup(){
        Navigate('/signup');
    }

    return(
        <div className='login-container'>
            <form onSubmit={handleLogin} className='login-form'>

                <div className='login-head'>
                    <h2>Login</h2>
                </div>

                <label>Email</label>
                <div className='login-icons'>
                    <FontAwesomeIcon icon={faEnvelope} className='icon' />
                    <input
                    type='text'
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className='input-field'
                    />
                </div>

                <label>Password</label>
                <div className='login-icons'>
                    <FontAwesomeIcon icon={faLock} className='icon'/>
                    <input
                    type='password'
                    placeholder="Password"
                    onChange={(e) => setPass(e.target.value)}
                    className='input-field'
                    />
                </div>
                

                <p ref={invRef} style={{display: 'none'}} className='login-err'><span>*Error:</span> Invalid Credentials</p>

                <button type='submit' className='login-btn'>LOGIN</button>

                <div className='signup'>
                    <p>Or Signup Using</p>
                    <button onClick={handleNavigateSignup}>SIGN UP</button> 
                </div>
            </form>
        </div>
    )
}

export default Login;