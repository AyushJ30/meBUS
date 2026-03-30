const {User, City, Point, Country, State, Bus, Booking, Day, Passenger, Seat} = require('../models/connect');
const {catchAsync} = require('../utilities/catchAsync');
const {adminLoginVer, adminSignupVer} = require('../services/objectVerification');
const {setUser} = require('../services/auth');

const handleAdminRegister= catchAsync(async function (req,res){
    const {Name, Age, Gender, Email, Password, Phone} = req.body;
    const File = req.file;
    
    const conti = adminSignupVer(Name, Age, Gender, Email, Password, Phone, File, res);

    if(conti){
        await User.create({
            name: Name,
            age: Age,
            gender: Gender,
            email: Email,
            password: Password,
            phone: Phone,
            fileName: File.originalname,
            role: 'Admin'
        });
        
        return res.redirect('/admin/');
    }
});

const handleAdminRegisterPage = catchAsync(async function(req, res){
    return res.render('register');
});

const handleAdminLogin= catchAsync(async function (req,res){
    const body = req.body;

    const conti = adminLoginVer(body.Email, body.Password, res);

    if(conti){
        const admin = await User.findOne({
            where: {
                email: body.Email,
                password: body.Password,
                role: 'Admin',
            }
        });

        if(!admin){
            return res.status(401).render('login', {
                errorMessage: 'Invalid email, password, or unauthorized access'
            });
        }

        const adminToken = setUser(admin);
        res.cookie('admin-token', adminToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/admin'
        });

        return res.redirect('/admin/');
    }
        
});

const handleAdminLoginPage = catchAsync(async function(req, res){
    return res.render('login');
});

const handleBusAddPage = catchAsync(async function(req, res){
    const Cities = await City.findAll({
        where: {
            status: true,
        }
    });

    if(!Cities){
        return res.status(401).render('bus', {
            errorMessage: "Couldn't fetch any cities that are active"
        });
    }

    return res.render('bus', {
        cities: Cities
    });
});

const handleCountryAddPage = catchAsync(async function(req, res){
    return res.render('country');
});

const handleStateAddPage = catchAsync(async function(req, res){
    const Countries = await Country.findAll({
        where: {
            status: true,
        }
    });

    if(!Countries){
        return res.status(404).render('country', {
            errorMessage: "No Active Country Found"
        });
    }

    return res.render('state', {
        countries: Countries,
    });
});

const handleCityAddPage = catchAsync(async function(req, res){
    const Countries = await Country.findAll({
        where: {
            status: true,
        }
    });

    if(!Countries){
        return res.status(404).render('country', {
            errorMessage: "No Active Country Found"
        });
    }

    const States = await State.findAll({
        where: {
            status: true,
        }
    });

    if(!States){
        return res.status(404).render('state', {
            errorMessage: "No Active State Found"
        });
    }

    return res.render('city', {
        countries: Countries,
        states: States
    })
});

const handlePointAddPage = catchAsync(async function(req, res){
    const Countries = await Country.findAll({
        where: {
            status: true,
        }
    });

    if(!Countries){
        return res.status(404).render('country', {
            errorMessage: "No Active Country Found"
        });
    }

    const States = await State.findAll({
        where: {
            status: true,
        }
    });

    if(!States){
        return res.status(404).render('state', {
            errorMessage: "No Active State Found"
        });
    }

    const Cities = await City.findAll({
        where: {
            status: true
        }
    });

    if(!Cities){
        return res.status(404).render('city', {
            errorMessage: "No Active City Found"
        });
    }

    return res.render('point', {
        countries: Countries,
        states: States,
        cities: Cities,
    })
});

const handleTablePage = catchAsync(async function(req, res){
    
    const Countries = await Country.findAll({
        raw:true
    });

    if(!Countries){
        return res.status(404).render('country', {
            errorMessage: "No Country Found"
        });
    }

    const States = await State.findAll({raw:true});

    if(!States){
        return res.status(404).render('state', {
            errorMessage: "No State Found"
        });
    }

    const Cities = await City.findAll({raw:true});

    if(!Cities){
        return res.status(404).render('city', {
            errorMessage: "No City Found"
        });
    }

    const Points = await Point.findAll({raw:true});

    if(!Points){
        return res.status(404).render('point',{
            errorMessage: "No Point Found"
        });
    }

    const Buses = await Bus.findAll({
        raw: true,
        nest: true,
        include: [{
            model: Day,
            as: 'schedule'
        }]
    });

    if(!Buses){
        return res.status(404).render('bus', {
            errorMessage: "No Bus Found"
        })
    }
    
    return res.render('table',{
        buses: Buses,
        points: Points,
        cities: Cities,
        states: States,
        countries: Countries,
    });
});

const handleAdminLogout = catchAsync(async function(req, res){
    res.cookie('admin-token', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/admin',
    });

    return res.redirect('/admin-login');
});

const handleBookingPage = catchAsync(async function(req, res) {
    const now = new Date();

    const allBookings = await Booking.findAll({
        include: [
            {
                model: Bus,
                attributes: ['name', 'origin', 'destination', 'start', 'duration'] 
            },
            {
                model: Passenger,
                as: 'passenger', // Make sure this matches your connect.js alias!
                include: [
                    {
                        model: Seat, 
                        attributes: ['seatNumber']
                    }
                ]
            }
        ],
        order: [['createdAt', 'DESC']] 
    });

    const formattedBookings = allBookings.map(booking => {
        const busData = booking.bus || {};
        const passData = booking.passenger || {};
        const seatData = passData.seat || passData.Seat || {};

        const bookingDate = new Date(booking.createdAt);
        const formattedDate = bookingDate.toISOString().split('T')[0];

        const journeyDateTime = new Date(booking.createdAt);
        if (busData.start) {
            const [hours, mins] = busData.start.split(':').map(Number);
            journeyDateTime.setHours(hours, mins, 0);
        }

        let displayStatus = "";
        if (booking.status === 0 || booking.status === false) { 
            displayStatus = 'Cancelled';
        } else if (journeyDateTime < now) {
            displayStatus = 'Completed';
        } else {
            displayStatus = 'Upcoming';
        }

        return {
            id: booking.id,
            userId: booking.userId, // Admin specific
            pnr: booking.pnr,
            totalAmount: booking.totalAmount,
            status: displayStatus,
            
            origin: busData.origin || 'N/A',
            destination: busData.destination || 'N/A',
            operatorName: busData.name || 'N/A', 
            
            date: formattedDate, 
            time: busData.start || 'N/A', 
            
            seats: seatData.seatNumber ? [seatData.seatNumber] : []
        };
    });

    return res.render('booking', {
        bookings: formattedBookings
    });
});

const handleFetchBusEditPage = catchAsync(async function(req, res){
    const { id } = req.params; // Get ID from URL

    // 1. Fetch the specific bus
    const bus = await Bus.findByPk(id);

    // 2. Fetch cities for the dropdowns
    const cities = await City.findAll({
        where: { status: 1 },
        order: [['name', 'ASC']]
    });

    if (!bus) {
        return res.status(404).send("Bus not found");
    }

    res.render('editBus', { 
        bus: bus, 
        cities: cities 
    });
});

module.exports = {
    handleAdminRegister,
    handleAdminRegisterPage,
    handleAdminLogin,
    handleAdminLoginPage,
    handleBusAddPage,
    handleCountryAddPage,
    handleStateAddPage,
    handleCityAddPage,
    handlePointAddPage,
    handleTablePage,
    handleAdminLogout,
    handleBookingPage,
    handleFetchBusEditPage
}