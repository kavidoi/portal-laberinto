const express = require('express');
const router = express.Router();

// In-memory array for demo purposes to store sales data
let salesData = [];

/**
 * POST /api/sales
 * Registers a new sale.
 */
router.post('/', (req, res) => {
  const sale = req.body;
  
  // Basic validation for required fields
  if (!sale.salesperson || !sale.discount || !sale.wines) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  // Add additional data like a unique ID and timestamp
  sale.id = salesData.length + 1;
  sale.createdAt = new Date();

  // Save the sale data in memory (or this can be replaced with a database call)
  salesData.push(sale);
  console.log("New sale registered:", sale);

  res.status(201).json({ message: "Sale registered successfully", sale });
});

module.exports = router;