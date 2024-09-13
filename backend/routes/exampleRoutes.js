// backend/routes/exampleRoutes.js
const express = require('express');
const { getExample } = require('../controllers/exampleController');

const router = express.Router();

// Define the route
router.get('/example', getExample);

module.exports = router;
