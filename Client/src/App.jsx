import {BrowserRouter, Routes, Route, Navigate} from 'react-router';

import Signup from "./Signup/Signup.jsx";
import Login from './Login/Login.jsx';
import Home from './Home/Home.jsx';
import Buses from './Buses/Buses.jsx';
import Booking from './Booking/Booking.jsx';
import Profile from './Profile/Profile.jsx';
import ConfirmationPage from './Confirmation/Confirmation.jsx';
import UserBookings from './Bookings/UserBookings.jsx';
import PNRSearch from './PNRsearch/PnrSearch.jsx';

function App() {
    
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/'>
                    <Route index element={<Navigate to='/home' replace/>}/>

                    <Route path='signup'>
                        <Route index element={<Signup/>}/>
                    </Route>

                    <Route path='login'>
                        <Route index element= {<Login/>}/>
                    </Route>

                    <Route path='home'>
                        <Route index element={<Home/>}/>
                    </Route>

                    <Route path='buses'>
                        <Route index element={<Buses/>}/>
                    </Route>

                    <Route path='booking'>
                        <Route index element={<Booking/>}/>
                    </Route>

                    <Route path='profile'>
                        <Route index element={<Profile/>}/>
                        <Route path='bookings' element={<UserBookings/>}/>
                    </Route>

                    <Route path='confirmation'>
                        <Route index element={<ConfirmationPage/>}/>
                    </Route>

                    <Route path='search'>
                        <Route index element={<PNRSearch/>}/>
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
