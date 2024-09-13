// backend/index.js

// Import dependencies
const express = require('express');  // Express framework for building APIs
const dotenv = require('dotenv');    // For environment variable management

// Initialize the Express app and environment variables
dotenv.config();                     // Load .env configuration
const app = express();
app.use(express.json());             // Use JSON parser for request bodies

// Sample route to check if the server is running
app.get('/', (req, res) => {
  res.send('Blockchain Backend is running!');
});

// Sample route to interact with the blockchain
app.get('/balance/:address', async (req, res) => {
  const address = req.params.address;
  const web3 = new Web3(process.env.BLOCKCHAIN_URL);  // Connect to blockchain
  const balance = await web3.eth.getBalance(address); // Get balance of address
  res.json({ balance });
});

// Start the backend server
const PORT = process.env.PORT || 3000;  // Use PORT from environment or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// test

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Blockchain API',
      version: '1.0.0',
    },
  },
  apis: ['index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
