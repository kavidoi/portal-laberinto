const express = require('express');
const Airtable = require('airtable');

// Configure Airtable client
// Make sure AIRTABLE_BASE_ID and AIRTABLE_API_KEY are in your .env file
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const table = base('Contactos'); // Use the exact name of your Contactos table

const router = express.Router();

// GET /api/contactos - Fetches all contacts
router.get('/', async (req, res) => {
  try {
    const records = await table.select({
      // Add any necessary view or fields here if needed, e.g., fields: ['Nombre']
      // Specify the fields needed for the datalist and the discount hint
      fields: ['Nombre', 'Descuento por Club o B2B', 'Club'] // Adjust field names if different in Airtable
    }).all();

    // Respond with the fetched records, including IDs and specified fields
    // Note: The frontend expects an array of objects like { fields: { Nombre: '...' } }
    res.json(records.map(record => ({ id: record.id, fields: record.fields })));

  } catch (error) {
    console.error('Error fetching Contactos from Airtable:', error);
    res.status(500).json({ message: 'Error fetching contacts from Airtable', error: error.message });
  }
});

module.exports = router;
