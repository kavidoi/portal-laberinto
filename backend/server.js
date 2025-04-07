require('dotenv').config();
const express = require('express');
const path = require('path');
const salesRouter = require('./routes/sales');
const vendorsRouter = require('./routes/vendors');
const contactosRouter = require('./routes/contactos'); // <-- Add this line


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static front-end files from the public folder
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Mount the sales API routes under /api/sales
app.use('/api/sales', salesRouter);

// Mount the vendors API routes under /api/vendors
app.use('/api/vendors', vendorsRouter);
app.use('/api/contactos', contactosRouter); // <-- Add this line

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
