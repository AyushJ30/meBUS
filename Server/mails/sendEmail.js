require('dotenv').config();
const nodemailer = require('nodemailer');

const sendTicketEmail = async (email, bookingDetails) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS 
            }
        });

        const formattedDate = new Date(bookingDetails.travelDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        let passengersHtml = '';
        if (bookingDetails.passengers && bookingDetails.passengers.length > 0) {
            bookingDetails.passengers.forEach((pass) => {
                passengersHtml += `
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${pass.name}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${pass.age}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${pass.gender}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;"><strong>${pass.seatNumber}</strong></td>
                    </tr>
                `;
            });
        }

        const htmlTemplate = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <div style="background-color: #6fa6b7; color: white; padding: 25px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">meBUS Ticket Confirmation</h1>
                </div>
                
                <div style="padding: 30px; background-color: #f4f7f6;">
                    <h2 style="color: #006938; margin-top: 0;">Booking Successful!</h2>
                    <p style="color: #555; line-height: 1.5;">Hi there,</p>
                    <p style="color: #555; line-height: 1.5;">Your journey is confirmed. Here are your ticket details:</p>
                    
                    <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 5px solid #588a58; margin: 25px 0; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                        <p style="margin: 0 0 10px 0;"><strong>PNR:</strong> <span style="font-size: 18px; color: #333; font-weight: bold; padding: 3px 8px; background: #eef3ef; border-radius: 4px;">${bookingDetails.pnr}</span></p>
                        <p style="margin: 0 0 10px 0; color: #444;"><strong>Route:</strong> ${bookingDetails.bus.origin} &rarr; ${bookingDetails.bus.destination}</p>
                        <p style="margin: 0 0 10px 0; color: #444;"><strong>Date:</strong> ${formattedDate}</p>
                        <p style="margin: 0 0 10px 0; color: #444;"><strong>Departure Time:</strong> ${bookingDetails.bus.start}</p>
                        <p style="margin: 0; color: #444;"><strong>Bus:</strong> ${bookingDetails.bus.name}</p>
                    </div>

                    <h3 style="color: #006938; margin-top: 30px; border-bottom: 2px solid #e0e0e0; padding-bottom: 8px;">Passenger Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; background-color: white; border-radius: 8px; overflow: hidden;">
                        <thead>
                            <tr style="background-color: #eef3ef; text-align: left;">
                                <th style="padding: 12px 10px; color: #588a58;">Name</th>
                                <th style="padding: 12px 10px; color: #588a58;">Age</th>
                                <th style="padding: 12px 10px; color: #588a58;">Gender</th>
                                <th style="padding: 12px 10px; color: #588a58;">Seat</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${passengersHtml}
                        </tbody>
                    </table>

                    <div style="background-color: #eef3ef; padding: 15px; border-radius: 8px; text-align: right;">
                        <p style="margin: 0; font-size: 16px; color: #333;"><strong>Total Amount Paid:</strong> <span style="color: #006938; font-size: 18px;">₹${bookingDetails.totalAmount}</span></p>
                    </div>
                    
                    <div style="margin-top: 35px; border-top: 1px dashed #ccc; padding-top: 20px; text-align: center;">
                        <p style="font-size: 13px; color: #777; line-height: 1.5;">You can view or download your digital ticket anytime by visiting our website and entering your PNR in the <strong>PNR Search</strong> section.</p>
                        <p style="font-size: 14px; color: #555; font-weight: bold; margin-top: 15px;">Have a safe journey!<br/>- The meBUS Team</p>
                    </div>
                </div>
            </div>
        `;

        const mailOptions = {
            from: '"meBUS Travel" <urlshortener19.02@gmail.com>', 
            to: email,
            subject: `Ticket Confirmed: ${bookingDetails.bus.origin} to ${bookingDetails.bus.destination} (PNR: ${bookingDetails.pnr})`,
            html: htmlTemplate
        };

        await transporter.sendMail(mailOptions);
        console.log(`Ticket email sent successfully to ${email}`);

    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendTicketEmail;