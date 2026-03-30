const {User, Booking, Bus, Passenger, Seat} = require('../models/connect');
const {ApiResponse} = require('../utilities/ApiResponse');
const {ApiError} = require('../utilities/ApiError');
const {catchAsync} = require('../utilities/catchAsync');
const {userSignupVer, userLoginVer} = require('../services/objectVerification');
const {separateDateTime} = require('../services/seperateDateTime');
const {setUser} = require('../services/auth');
 
const handleFetchUserProfile = catchAsync(async function (req, res){
    const ID = req.user.id;

    const user = await User.findOne({
        where: {
            id: ID,
        }
    });
    if(!user){
        throw new ApiError(404, "User not Found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User profile fetched successfully")
    );
});

const handleChangeUserDetails = catchAsync(async function (req, res){
    const ID = req.user.id;
    const body = req.body;

    const user = await User.update({
        name: body.Name,
        age: body.Age,
        gender: body.Gender,
        phone: body.Phone
    }, {
        where:{
            id: ID,
        }
    });

    return res.status(200).json(
        new ApiResponse(200, user, "User profile changed successfully")
    );
});

const handleChangeUserPassword = catchAsync(async function (req, res){
    const ID = req.user.id;
    const {Password} = req.body;

    await User.update({
        password: Password,
    },{
        where: {
            id: ID
        }
    });
    
    return res.status(200).json(
        new ApiResponse(200, null, "Password updated successfully")
    );
    
});

const handleUserSignUp = catchAsync(async function (req, res){
    const body = req.body;
    const Name = body.Name;
    const Age = body.Age;
    const Gender = body.Gender;
    const Email = body.Email;
    const Password = body.Password;
    const Phone = body.Phone;
    const File = req.file;

    userSignupVer(Name, Age, Gender, Email, Password, Phone, File);

    try{
        const newUser = await User.create({
            name: Name,
            age: Age,
            gender: Gender,
            email: Email,
            password: Password,
            phone: Phone,
            fileName: File.originalname
        });
        
        return res.status(200).json(
            new ApiResponse(200, newUser, "User Signed up successfully")
        );
    } catch(err){
        console.error('Error occured while signing up: ', err);
    }

    

});

const handleUserLogin = catchAsync(async function(req, res){
    const {Email, Password} = req.body;

    userLoginVer(Email, Password);
 
        const user = await User.findOne({
            where: {
                email: Email,
                password: Password,
            }
        });

        if(!user){
            throw new ApiError(404, "User not Found");
        }

        const token = setUser(user.toJSON());
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        return res.status(200).json(
            new ApiResponse(200, user, "User Logged in Successfully")
        );
});

const handleFetchUserBookings = catchAsync(async function(req, res) {
    const userId = req.user.id; 
    const now = new Date();

    try {
         const userBookings = await Booking.findAll({
            where: {
                userId: userId,
                status: true, 
            },
            include: [
                {
                    model: Bus,
                    attributes: ['name', 'origin', 'destination', 'start', 'duration'] 
                },
                {
                    model: Passenger,
                    as: 'passenger',
                    attributes: ['id'],
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

        const formattedBookings = userBookings.map(booking => {
            const busData = booking.bus || {};
            const passData = booking.passenger || {};
            const seatData = passData.seat || passData.Seat || {};

            const bookingDate = new Date(booking.travelDate);
            const formattedDate = bookingDate.toISOString().split('T')[0]; // Yields "YYYY-MM-DD"

            const journeyDateTime = new Date(booking.travelDate);
            if (busData.start) {
                const [hours, mins, secs] = busData.start.split(':').map(Number);
                journeyDateTime.setHours(hours, mins, secs || 0, 0);
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
                pnr: booking.pnr,
                totalAmount: booking.totalAmount,
                status: displayStatus,
                
                origin: busData.origin,
                destination: busData.destination,
                operatorName: busData.name, 
                
                date: formattedDate, 
                time: busData.start, 
                duration: busData.duration, 
                
                seats: [seatData.seatNumber]
            };
        });

        return res.status(200).json(
            new ApiResponse(200, formattedBookings, "User bookings fetched successfully")
        );
    } catch(err){
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error")); 
    }
});

const handleUserLogout = catchAsync(async function(req, res){
    res.cookie('token', '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
    });

    return res.status(200).json(
        new ApiResponse(200, null, 'Logged-out successfully')
    );
});

module.exports = {
    handleFetchUserProfile,
    handleChangeUserPassword,
    handleUserSignUp,
    handleUserLogin,
    handleFetchUserBookings,
    handleChangeUserDetails,
    handleUserLogout
}