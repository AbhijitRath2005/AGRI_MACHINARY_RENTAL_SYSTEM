import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoice = async (payment, booking) => {
    return new Promise((resolve, reject) => {
        try {
            // Create invoices directory if it doesn't exist
            const invoicesDir = path.join(process.cwd(), 'invoices');
            if (!fs.existsSync(invoicesDir)) {
                fs.mkdirSync(invoicesDir, { recursive: true });
            }

            const invoiceFileName = `invoice_${payment._id}.pdf`;
            const invoicePath = path.join(invoicesDir, invoiceFileName);

            // Create PDF document
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(invoicePath);

            doc.pipe(stream);

            // Add content to PDF
            doc.fontSize(20).text('INVOICE', { align: 'center' });
            doc.moveDown();

            doc.fontSize(12).text(`Invoice Number: INV-${payment._id}`);
            doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);
            doc.moveDown();

            doc.text('Bill To:');
            doc.text(`${booking.userId.name}`);
            doc.text(`${booking.userId.email}`);
            doc.moveDown();

            doc.text('Booking Details:');
            doc.text(`Machine: ${booking.machineId.name}`);
            doc.text(`Type: ${booking.machineId.type}`);
            doc.text(`Start Date: ${new Date(booking.startDate).toLocaleDateString()}`);
            doc.text(`End Date: ${new Date(booking.endDate).toLocaleDateString()}`);
            doc.text(`Total Days: ${booking.totalDays}`);
            doc.moveDown();

            doc.text('Payment Details:');
            doc.text(`Transaction ID: ${payment.transactionId}`);
            doc.text(`Payment Method: ${payment.paymentMethod}`);
            doc.text(`Amount: ₹${payment.amount}`);
            doc.moveDown();

            doc.fontSize(14).text(`Total Amount: ₹${payment.amount}`, { bold: true });

            doc.end();

            stream.on('finish', () => {
                resolve(`/invoices/${invoiceFileName}`);
            });

            stream.on('error', (error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
};
