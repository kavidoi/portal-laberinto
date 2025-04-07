const express = require('express');
const Airtable = require('airtable');
const router = express.Router();

// Configure Airtable with API credentials
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID);

/*
  GET /api/vendors
  Retrieves unique display names for "Vendedor" by fetching records from the "Equipo" table.
  The linked record field "Persona" is expanded, and its value is extracted from the 'Persona' column.
*/
router.get('/', (req, res) => {
  let persons = new Set();
  
  base('Equipo')
    .select({
      view: "Grid view",
      expand: ['Persona']   // Expand the linked record for the "Persona" field
    })
    .eachPage(
      (records, fetchNextPage) => {
        records.forEach(record => {
          const personData = record.get('Persona');
          if (personData && Array.isArray(personData)) {
            personData.forEach(person => {
              let displayName = null;
              // If person is an object and has a fields property, extract the "Persona" field value.
              if (typeof person === 'object' && person.fields) {
                // Use "Persona" instead of "Name" because the linked record's first column is "Persona"
                displayName = person.fields['Persona'] || Object.values(person.fields)[0];
              } else if (typeof person === 'string') {
                displayName = person;
              }
              if (displayName) {
                persons.add(displayName);
              }
            });
          }
        });
        fetchNextPage();
      },
      (err) => {
        if (err) {
          console.error('Error fetching persons:', err);
          return res.status(500).json({ error: 'Error fetching persons' });
        }
        res.json(Array.from(persons));
      }
    );
});

module.exports = router;