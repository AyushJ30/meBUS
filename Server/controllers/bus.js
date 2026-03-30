const{Op} = require('sequelize');
const {Bus, Booking, Passenger, Day} = require('../models/connect');
const {ApiResponse} = require('../utilities/ApiResponse');
const { ApiError } = require('../utilities/ApiError');
const { catchAsync } = require('../utilities/catchAsync');
const {calculateArrivalTime} = require('../utilities/arrivalTimeCalculator');

const handleFetchBusesEnroute = catchAsync(async function(req, res){
    const {Origin, Destination, Start} = req.body;

    const requestedDate = new Date(Start);
    const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayName = daysOfWeek[requestedDate.getDay()];

    const now = new Date();
    const todayString = now.toISOString().split('T')[0];


    let timeFilter = {}

    if (Start === todayString) {
        const futureTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);
        const minStartTime = futureTime.toTimeString().split(' ')[0];
        timeFilter = { start: { [Op.gte]: minStartTime } };
    }

        const buses = await Bus.findAll({
            where: {
                status: true,
                origin: Origin,
                destination: Destination,
                ...timeFilter 
            },
            include: [
                {
                    model: Day,
                    as: 'schedule', 
                    where: {
                        [dayName]: true 
                    },
                    attributes: [] 
                }
            ], raw: true
        });
         
        if(!buses || buses.length === 0){
            throw new ApiError(404, "No Buses found on this route for the selected date");
        }

        const busesWithArrival = buses.map(bus => {
        return {
            ...bus,
            arrivalTime: calculateArrivalTime(bus.start, bus.duration)
        };
    });

        return res.status(200).json(
            new ApiResponse(200, busesWithArrival, "Buses on this route fetched successfully")
        );
});

const handleAddBus = catchAsync(async function(req, res){
    const body = req.body;

    console.log("Incoming Bus Data:", body);

    if(!body.Name || !body.Origin || !body.Destination || !body.Start || !body.Duration || !body.Fare || !body.Seats || !body.Price){
        return res.render('bus',{
            errorMessage: "Missing Fields"
        });
    }

        const newBus = await Bus.create({
            name: body.Name,
            origin: body.Origin,
            destination: body.Destination,
            start: body.Start,
            duration: body.Duration, 
            fare: body.Fare,
            totalSeats: body.Seats,
            avlSeats: body.Seats,    
            finalPrice: body.Price,          
        });

        const Days = body.Days; 
        const runningDays = Array.isArray(Days) ? Days : (Days ? [Days] : []);

        await Day.create({
            busId: newBus.id, 
            sun: runningDays.includes('sun'),
            mon: runningDays.includes('mon'),
            tue: runningDays.includes('tue'),
            wed: runningDays.includes('wed'),
            thu: runningDays.includes('thu'),
            fri: runningDays.includes('fri'),
            sat: runningDays.includes('sat')
        });

        return res.redirect('/admin/');
});   

const handleFetchBusDetails = catchAsync(async function(req, res){
    const ID = req.params.id;

    const bus = await Bus.findOne({
        where: {
            id: ID
        }
    });

    if(!bus){
        throw new ApiError(404, "This Bus does not exist");
    } 

    return res.status(200).json(
        new ApiResponse(200, bus, "Bus details fetched Successfully")
    );
});

const handleFetchBookedSeats = catchAsync(async (req, res) => {
    const busId = req.params.id;
    
    const travelDate = req.query.date; 

    if (!travelDate) {
        throw new ApiError(400, "Travel date is required to fetch seats");
    }

    const bookings = await Booking.findAll({
        where: {
            busId: busId,
            travelDate: {
                [Op.startsWith]: travelDate 
            },
            status: true
        },
        include: [
            {
                model: Passenger,
                as: 'passenger',
                attributes: ['seatNumber']
            }
        ]
    });

    const bookedSeats = bookings
        .filter(b => b.passenger) 
        .map(b => parseInt(b.passenger.seatNumber, 10));

    return res.status(200).json(
        new ApiResponse(200, bookedSeats, "Booked seats fetched for specific date")
    );
});

const handleEditBusDetails = catchAsync(async function(req, res){
    const id = req.params.id;
    const { Origin, Destination, Fare, Price, Seats, Start, Duration, Days } = req.body;

    console.log("Updating Bus ID:", id);
    console.log("Received Body:", req.body);

    const selectedDays = Array.isArray(Days) ? Days : (Days ? [Days] : []);

    const updatedSchedule = {
        sun: selectedDays.includes('sun'),
        mon: selectedDays.includes('mon'),
        tue: selectedDays.includes('tue'),
        wed: selectedDays.includes('wed'),
        thu: selectedDays.includes('thu'),
        fri: selectedDays.includes('fri'),
        sat: selectedDays.includes('sat')
    };

    await Bus.update({
        origin: Origin,
        destination: Destination,
        fare: Fare,
        finalPrice: Price,
        totalSeats: Seats,
        start: Start,
        duration: Duration,
        schedule: updatedSchedule
    }, {
        where: { id: id }
    });

    await Day.update({
        sun: selectedDays.includes('sun'),
        mon: selectedDays.includes('mon'),
        tue: selectedDays.includes('tue'),
        wed: selectedDays.includes('wed'),
        thu: selectedDays.includes('thu'),
        fri: selectedDays.includes('fri'),
        sat: selectedDays.includes('sat')
    }, { 
        where: { busId: id }
    });

    return res.redirect('/admin/table');
});

module.exports = {
    handleFetchBusesEnroute,
    handleAddBus,
    handleFetchBusDetails,
    handleFetchBookedSeats,
    handleEditBusDetails
}