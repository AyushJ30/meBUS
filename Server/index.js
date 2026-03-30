require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true
}

const {connectToDB} = require('./connectDB');
const {checkAuthentication} = require('./middleware/auth');

const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const busRouter = require('./routes/bus');
const bookingRouter = require('./routes/booking');
const locationRouter = require('./routes/location');

const {handleFetchBusesEnroute} = require('./controllers/bus');
const { handleFetchPNRTicket } = require('./controllers/booking');

const app = express();
const PORT = process.env.PORT;

connectToDB(); 

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', loginRouter);
app.use('/location', locationRouter);
app.post('/busfetch', handleFetchBusesEnroute);
app.get('/pnr/:pnr', handleFetchPNRTicket);

app.use(checkAuthentication);

app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/bus', busRouter);
app.use('/booking', bookingRouter); 


app.listen(PORT, () => console.log(`Your SV started at: http://localhost:${PORT}`));