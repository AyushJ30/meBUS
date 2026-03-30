const {Booking, Passenger, Bus, Point, Seat} = require('../models/connect');
const { ApiError } = require('../utilities/ApiError');
const { ApiResponse } = require('../utilities/ApiResponse');
const {catchAsync} = require('../utilities/catchAsync');
const {busBookVer, passengerVer} = require('../services/objectVerification');
const {sequelize} = require('../connectDB');
const {Sequelize} = require('sequelize');
const sendTicketEmail = require('../mails/sendEmail');

const handlePassengerDetails= catchAsync(async function(req,res){
    const {Name, Age, Gender, Email, Phone, Board, Drop, SeatNumber} = req.body;
    const BusID = req.params.id;

    console.log("Passenger Body: ", req.body);
    console.log('BusID: ', BusID);

    passengerVer(Name, Age, Gender, Email, Phone, BusID);
        try{
            const passenger = await Passenger.create({
                name: Name, 
                age: Age,
                gender: Gender,
                email: Email,
                phone: Phone,
                busId: BusID,
                board: Board,
                drop: Drop,
                seatNumber: SeatNumber,
            });

            if(!passenger){
                throw new ApiError(409, "Could Not create passenger");
            }

            await Seat.create({
                seatNumber: SeatNumber,
                isBooked: true,
                busId: BusID,
                passengerId: passenger.id
            });

            return res.status(200).json(
                new ApiResponse(200, passenger, "Passanger created successfully")
            );
        } catch (err) {
            console.log("🔥 THE REAL SQL ERROR:", err.original ? err.original.sqlMessage : err.message);
            
            throw new ApiError(409, "Could Not create passenger");
        }
        
});     

const handleBusBook= catchAsync(async function(req,res){
    const UserID = req.user.id;
    const BusID = req.params.id;
    const {PassengerID, Cancel, Insure, TotalAmount, PNR, TravelDate} = req.body;

    busBookVer(UserID, BusID, PassengerID);

        await Booking.create({
            userId: UserID,
            busId: BusID,
            passengerId: PassengerID,
            cancellation: Cancel,
            insurance: Insure,
            totalAmount: TotalAmount,
            pnr: PNR,
            travelDate: TravelDate,
        });
        
        return res.status(200).json(
            new ApiResponse(200, null, "Booking Successfull")
        );
}); 

const handleFetchBoardingPoints = catchAsync(async function(req, res){
    const Origin = req.params.origin;

    const boarding = await Point.findAll({
        where: {
            cityName: Origin,
            type: 'Boarding'
        }
    });

    if(!Origin){
        throw new ApiError(404, "No Boarding Points found in this city");
    }

    return res.status(200).json(
        new ApiResponse(200, boarding, "Boarding Points fetched successfully")
    );
});

const handleFetchDropPoints = catchAsync(async function(req, res){
    const Dest = req.params.dest;

    const dropping = await Point.findAll({
        where: {
            cityName: Dest,
            type: 'Dropping'
        }
    });

    if(!dropping){
        throw new ApiError(404, "No Dropping Points found in this city");
    }

    return res.status(200).json(
        new ApiResponse(200, dropping, "Dropping Points fetched successfully")
    );
});

const handleCancelUserBookings = catchAsync(async function(req, res){
    const userId = req.user.id; 
    const bookingId = req.params.id; 

    if (!bookingId) {
        return res.status(400).json(
            new ApiResponse(400, null, "Booking ID is required")
        );
    }

    const booking = await Booking.findOne({
        where: {
            id: bookingId,
            userId: userId
        }
    });

    if (!booking) {
        return res.status(404).json(
            new ApiResponse(404, null, "Booking not found or you don't have permission to cancel it")
        );
    }

    const busId = booking.busId;
    const passengerId = booking.passengerId;

    await sequelize.transaction(async (t) => {
        
        await Seat.destroy({
            where: { passengerId: passengerId },
            transaction: t
        });

        await booking.destroy({ transaction: t });

        await Passenger.destroy({
            where: { id: passengerId },
            transaction: t
        });

        await Bus.increment('avlSeats', {
            by: 1,
            where: { id: busId },
            transaction: t
        });
    });

    return res.status(200).json(
        new ApiResponse(200, null, "Booking cancelled successfully. Data has been removed and seats updated.")
    );
});

const handleChangeBookingStatus = catchAsync(async function(req, res){
    const ID = req.params.id;

    await Booking.update({
            status: Sequelize.literal('NOT status'),
        }, {
            where: {
                id: ID,
            }
        });

        
        return res.status(200).json({ success: true });
});

const handleFetchPNRTicket = catchAsync(async function(req, res){
    const PNR = req.params.pnr;

    const booking = await Booking.findOne({
        where: {
            status: true,
            pnr: PNR
        }
    });

    if(!booking){
        throw new ApiError(404, "No active booking of this PNR found");
    }

    const bus = await Bus.findOne({
        where: {
            id: booking.busId
        }
    });

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    const isFutureDate = booking.travelDate > today;
    const isTodayButFutureTime = (booking.travelDate === today) && (bus.start > currentTime);

    if (!isFutureDate && !isTodayButFutureTime) {
        throw new ApiError(400, "This ticket is for a past journey.");
    }

    const passenger = await Passenger.findOne({
        where:{
            id: booking.passengerId,
        }
    });

    const bookingData = {
        pnr: booking.pnr,
        travelDate: booking.travelDate, 
        status: booking.status ? "Active" : "Cancelled", 
        board: passenger.board,
        drop: passenger.drop,
        totalAmount: booking.totalAmount,
        createdAt: booking.createdAt,
        bus: {
            name: bus.name,
            origin: bus.origin,
            destination: bus.destination,
            start: bus.start,
            duration: bus.duration,
        },
        passengers: [
            {
                name: passenger.name, 
                age: passenger.age,
                gender: passenger.gender,
                seatNumber: passenger.seatNumber
            }
        ]
    }

    return res.status(200).json(
        new ApiResponse(200, bookingData, "Successfully fetched Upcoming Booking Data")
    );
});

const handleSendTicketEmail = catchAsync(async function(req, res) {
    const { PNR, Email } = req.body;

    if (!PNR || !Email) {
        throw new ApiError(400, "PNR and Email are required to send ticket.");
    }

    const bookings = await Booking.findAll({
        where: { pnr: PNR },
        include: [
            { model: Bus, as: 'bus' },
            { model: Passenger, as: 'passenger' }
        ]
    });

    if (!bookings || bookings.length === 0) {
        throw new ApiError(404, "No bookings found for this PNR.");
    }

    const primaryBooking = bookings[0];
    const busDetails = primaryBooking.bus;
    
    const totalAmount = primaryBooking.totalAmount; 

    const passengerList = bookings.map(b => b.passenger);

    const emailData = {
        pnr: PNR,
        travelDate: primaryBooking.travelDate,
        totalAmount: totalAmount,
        bus: busDetails,
        passengers: passengerList
    };

    sendTicketEmail(Email, emailData).catch(err => console.log("Email failed to send:", err));

    return res.status(200).json(
        new ApiResponse(200, null, "Ticket email queued successfully")
    );
});

module.exports = {
    handlePassengerDetails,
    handleBusBook,
    handleFetchBoardingPoints,
    handleFetchDropPoints,
    handleCancelUserBookings,
    handleChangeBookingStatus,
    handleFetchPNRTicket,
    handleSendTicketEmail
}