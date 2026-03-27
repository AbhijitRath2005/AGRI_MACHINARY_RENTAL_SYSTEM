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

// Send welcome email on registration
export const sendWelcomeEmail = async (userEmail, userName, role) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('Email credentials not configured, skipping welcome email');
            return;
        }
        const transporter = createTransporter();
        const isFarmer = role === 'farmer';
        const roleLabel = isFarmer ? 'Farmer' : 'Machine Owner';
        const roleColor = isFarmer ? '#16a34a' : '#2563eb';
        const dashboardPath = isFarmer ? '/dashboard' : '/owner/dashboard';
        const appUrl = process.env.APP_URL || 'https://frontend-ruddy-eight-53.vercel.app';

        const mailOptions = {
            from: `"AgriRental" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Welcome to AgriRental, ${userName}! 🌾`,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f6f9f6;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9f6;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,${roleColor},${isFarmer ? '#059669' : '#4f46e5'});padding:40px 32px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:28px;font-weight:800;">🌾 AgriRental</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Agricultural Machinery Rental Platform</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px 32px;">
          <h2 style="color:#111;margin:0 0 12px;font-size:24px;">Welcome, ${userName}! 👋</h2>
          <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 20px;">Your <strong style="color:${roleColor}">${roleLabel}</strong> account has been created successfully on AgriRental.</p>
          ${isFarmer
            ? `<div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;font-size:14px;color:#15803d;font-weight:600;">🚜 As a Farmer you can:</p>
                <ul style="margin:8px 0 0;padding-left:20px;color:#374151;font-size:14px;line-height:2;">
                  <li>Browse available agricultural machinery</li>
                  <li>Book machines for your farm needs</li>
                  <li>Pay securely via UPI</li>
                  <li>Track your bookings in real-time</li>
                </ul>
              </div>`
            : `<div style="background:#eff6ff;border-left:4px solid #2563eb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
                <p style="margin:0;font-size:14px;color:#1d4ed8;font-weight:600;">🏭 As a Machine Owner you can:</p>
                <ul style="margin:8px 0 0;padding-left:20px;color:#374151;font-size:14px;line-height:2;">
                  <li>List your agricultural machinery</li>
                  <li>Receive and manage booking requests</li>
                  <li>Track payments and confirm bookings</li>
                  <li>Generate receipts for every rental</li>
                </ul>
              </div>`
          }
          <div style="text-align:center;margin:32px 0 24px;">
            <a href="${appUrl}${dashboardPath}" style="background:${roleColor};color:white;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:700;font-size:15px;display:inline-block;">Go to My Dashboard →</a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
          <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0;">If you did not create this account, please ignore this email.<br>For support, reply to this email.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© ${new Date().getFullYear()} AgriRental · Mumbai, Maharashtra</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${userEmail} (${role})`);
    } catch (error) {
        // Don't block registration if email fails
        console.error('Error sending welcome email:', error.message);
    }
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
