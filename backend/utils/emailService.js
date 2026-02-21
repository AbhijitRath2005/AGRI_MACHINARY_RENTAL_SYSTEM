import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send booking confirmation email
export const sendBookingConfirmation = async (userEmail, booking) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: 'Booking Confirmation - Agricultural Machinery Rental',
            html: `
        <h2>Booking Confirmation</h2>
        <p>Your booking has been confirmed!</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Machine:</strong> ${booking.machineId.name}</li>
          <li><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</li>
          <li><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</li>
          <li><strong>Total Days:</strong> ${booking.totalDays}</li>
          <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
        </ul>
        <p>Thank you for using our service!</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Booking confirmation email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
    }
};

// Send payment confirmation email
export const sendPaymentConfirmation = async (userEmail, booking, payment) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: 'Payment Confirmation - Agricultural Machinery Rental',
            html: `
        <h2>Payment Confirmation</h2>
        <p>Your payment has been successfully processed!</p>
        <h3>Payment Details:</h3>
        <ul>
          <li><strong>Transaction ID:</strong> ${payment.transactionId}</li>
          <li><strong>Amount:</strong> ₹${payment.amount}</li>
          <li><strong>Payment Method:</strong> ${payment.paymentMethod}</li>
          <li><strong>Date:</strong> ${new Date(payment.paymentDate).toLocaleDateString()}</li>
        </ul>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Machine:</strong> ${booking.machineId.name}</li>
          <li><strong>Start Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</li>
          <li><strong>End Date:</strong> ${new Date(booking.endDate).toLocaleDateString()}</li>
        </ul>
        <p>Thank you for your payment!</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Payment confirmation email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
    }
};

// Send maintenance notification
export const sendMaintenanceNotification = async (userEmail, maintenance) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: userEmail,
            subject: 'Maintenance Scheduled - Agricultural Machinery Rental',
            html: `
        <h2>Maintenance Scheduled</h2>
        <p>Maintenance has been scheduled for your machine.</p>
        <h3>Details:</h3>
        <ul>
          <li><strong>Machine:</strong> ${maintenance.machineId.name}</li>
          <li><strong>Scheduled Date:</strong> ${new Date(maintenance.scheduledDate).toLocaleDateString()}</li>
          <li><strong>Description:</strong> ${maintenance.description}</li>
          <li><strong>Status:</strong> ${maintenance.status}</li>
        </ul>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Maintenance notification email sent to:', userEmail);
    } catch (error) {
        console.error('Error sending maintenance notification email:', error);
    }
};
