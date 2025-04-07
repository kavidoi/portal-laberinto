import { formatForChile } from '../utils/localization.js';

/**
 * Fetches records from Airtable and applies Chilean formatting
 * @param {Object} table - Airtable table object
 * @param {Array} fields - Array of field names to include
 * @returns {Array} Formatted records
 */
const fetchLocalizedRecords = async (table, fields = ['Name', 'Email', 'Fecha', 'Monto', 'UpdatedAt']) => {
  const rawRecords = await table.select({
    filterByFormula: '{Status} = "Active"',
    fields: fields
  }).all();

  return formatForChile(rawRecords.map(record => record.fields));
};

/**
 * Gets formatted data from Airtable with Chilean localization
 * @param {Object} table - Airtable table object
 * @returns {Object} Response object with success status and data
 */
const getFormattedData = async (table) => {
  try {
    const localizedData = await fetchLocalizedRecords(table);
    return {
      success: true,
      data: localizedData
    };
  } catch (error) {
    console.error('Error fetching localized data:', error);
    return { 
      success: false,
      error: error.message
    };
  }
};

// Example of standard query without localization
const records = await table.select({
  filterByFormula: '{Status} = "Active"',
  fields: ['Name', 'Email', 'LinkedRecordsField'] // Include linked fields here
}).all();

export { fetchLocalizedRecords, getFormattedData };
