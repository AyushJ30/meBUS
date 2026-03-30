import React, { useState } from 'react';
import './Payment.css';

function Payment({ bus, seats, cancel, insure, onPaymentSuccess }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const baseFare = bus.finalPrice * seats.length;
    const cancellationFee = cancel ? (50 * seats.length) : 0;
    const insuranceFee = insure ? (15 * seats.length) : 0;
    const totalAmount = baseFare + cancellationFee + insuranceFee;

    const upiID = "ayushjha993-1@oksbi";
    const qrData = `upi://pay?pa=${upiID}&pn=meBus&am=${totalAmount}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

    const handleSimulatePayment = () => {
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess(totalAmount);
        }, 2000);
    }

    return (
        <div className="payment-container">
            <div className="payment-header">
                <h3>Complete Your Payment</h3>
                <p>Review your fare and scan the QR to pay safely.</p>
            </div>

            <div className="payment-content-wrapper">
                {/* --- Fare Breakdown Card --- */}
                <div className="card-box fare-card">
                    <div className="card-header">
                        <h3>Fare Summary</h3>
                    </div>
                    
                    <div className="fare-breakdown">
                        <div className="receipt-row">
                            <span className="receipt-label">Base Fare ({seats.length} Seats)</span>
                            <span className="receipt-value">₹{baseFare}</span>
                        </div>
                        
                        {cancel && (
                            <div className="receipt-row">
                                <span className="receipt-label">Free Cancellation Add-on</span>
                                <span className="receipt-value">₹{cancellationFee}</span>
                            </div>
                        )}
                        
                        {insure && (
                            <div className="receipt-row">
                                <span className="receipt-label">Travel Insurance Add-on</span>
                                <span className="receipt-value">₹{insuranceFee}</span>
                            </div>
                        )}
                        
                        <div className="receipt-row total-row">
                            <span className="receipt-label">Total Amount</span>
                            <span className="receipt-value total-price">₹{totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* --- QR Payment Card --- */}
                <div className="card-box qr-card">
                    <div className="card-header text-center">
                        <h3>Pay via UPI</h3>
                        <p>Scan with any UPI app (GPay, PhonePe, Paytm)</p>
                    </div>

                    <div className="qr-section">
                        <div className="qr-image-wrapper">
                            <img src={qrCodeUrl} alt="Payment QR Code" className="qr-image" />
                        </div>
                        <div className="upi-details">
                            <span>UPI ID:</span>
                            <span className="upi-id">{upiID}</span>
                        </div>
                    </div>

                    <div className="payment-actions">
                        <button 
                            className={`proceed-btn ${isProcessing ? 'processing' : ''}`} 
                            onClick={handleSimulatePayment}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processing Payment..." : `Simulate Payment of ₹${totalAmount}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;