const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PDFDocument } = require('pdf-lib');
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/invoiceDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const invoiceSchema = new mongoose.Schema({
    company: String,
    client: String,
    date: String,
    amount: Number
});
const Invoice = mongoose.model('Invoice', invoiceSchema);

app.use(bodyParser.json());
app.use(express.static('public'));  // Serve static files for frontend

// Route to save invoice to database
app.post('/api/invoices', async (req, res) => {
    const { company, client, date, amount } = req.body;
    const invoice = new Invoice({ company, client, date, amount });
    try {
        await invoice.save();
        res.status(200).json({ message: 'Invoice saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save invoice' });
    }
});

// Route to generate PDF
app.post('/api/download-pdf', async (req, res) => {
    const { company, client, date, amount } = req.body;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText(`Invoice`, { x: 50, y: 350, size: 30 });
    page.drawText(`Company: ${company}`, { x: 50, y: 300 });
    page.drawText(`Client: ${client}`, { x: 50, y: 270 });
    page.drawText(`Date: ${date}`, { x: 50, y: 240 });
    page.drawText(`Amount: $${amount}`, { x: 50, y: 210 });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytes));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
