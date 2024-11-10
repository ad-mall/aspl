document.getElementById('invoiceForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const invoiceData = {
        company: document.getElementById('company').value,
        client: document.getElementById('client').value,
        date: document.getElementById('date').value,
        amount: document.getElementById('amount').value
    };

    axios.post('/api/invoices', invoiceData)
        .then(response => {
            console.log('Invoice saved', response.data);
            alert('Invoice created!');
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('downloadPDF').addEventListener('click', function() {
    const invoiceData = {
        company: document.getElementById('company').value,
        client: document.getElementById('client').value,
        date: document.getElementById('date').value,
        amount: document.getElementById('amount').value
    };

    axios.post('/api/download-pdf', invoiceData, { responseType: 'blob' })
        .then(response => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'invoice.pdf';
            link.click();
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
