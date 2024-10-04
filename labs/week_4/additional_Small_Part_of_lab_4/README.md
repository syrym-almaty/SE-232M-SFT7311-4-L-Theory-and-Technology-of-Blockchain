# **Lab 4: Comprehensive Blockchain Application Development with Solidity and Web3**

## **1. Lab Overview**

### **1.1 Lab Details**

- **Lab Number:** 4
- **Title:** Comprehensive Blockchain Application Development with Solidity and Web3
- **Duration:** 3 Hours (Extended Laboratory Session)
- **References:**
  - [3] Modi, R. (2018). *Solidity Programming Essentials*. Packt Publishing.
  - [7] Van de Sande, A. (2021). *Web3: The Future of the Internet*. O'Reilly Media.
  - [8] Ethereum Developer Documentation - ethereum.org
  - [10] Raval, S. (2017). *Decentralized Applications: Harnessing Bitcoin's Blockchain Technology*. O'Reilly Media.
- **Reporting Format:** Formal Lab Report (4 Points)
- **Submission Deadline:** Next Laboratory Session

### **1.2 Lab Objectives**

The primary objectives of this lab are to:

- Develop advanced Solidity smart contracts implementing complex functionalities.
- Integrate smart contracts with a backend application using Web3.js.
- Implement and test RESTful API endpoints interacting with smart contracts.
- Ensure the application works reliably with 100% stability and confidence.

Secondary objectives include:

- Enhancing proficiency in Solidity programming, including advanced concepts.
- Deepening understanding of blockchain integration with backend services.
- Gaining practical experience with testing frameworks and best practices.

### **1.3 Expected Learning Outcomes**

Upon successful completion of this lab, students will be able to:

- Write advanced Solidity smart contracts using best practices.
- Deploy smart contracts to Ethereum test networks confidently.
- Implement robust RESTful APIs interacting with smart contracts.
- Conduct unit testing of smart contracts using Truffle and Mocha.
- Ensure the developed application operates reliably and securely.

---

## **2. Background and Theoretical Foundations**

### **2.1 Advanced Solidity Concepts**

Solidity, being a contract-oriented language, allows for the creation of complex smart contracts involving inheritance, libraries, interfaces, and design patterns like the Factory and Proxy patterns.

### **2.2 Smart Contract Testing**

Testing smart contracts is crucial to ensure their reliability and security. Frameworks like Truffle and Mocha enable developers to write unit tests for smart contracts, simulating various scenarios and edge cases.

### **2.3 Backend Integration**

Integrating smart contracts with backend applications involves using Web3.js to interact with the blockchain. Implementing RESTful APIs allows external clients to interact with the smart contracts in a standardized manner.

### **2.4 Security Best Practices**

Ensuring the security of smart contracts and backend applications is paramount. Practices include input validation, secure handling of private keys, and awareness of common vulnerabilities like reentrancy attacks.

---

## **3. Prerequisites**

Before beginning this lab, ensure that you have:

- Completed previous labs and practical works, especially related to DApp development.
- Proficiency in:

  - JavaScript and Node.js.
  - Solidity programming.
  - Express.js framework.
  - Web3.js library.

- Installed the following software:

  - **Node.js** (version 14 or later).
  - **Git** for version control.
  - **Truffle Suite** for smart contract development.
  - **Ganache** for local blockchain testing.
  - **Postman** or **cURL** for API testing.

- Access to the course's **GitHub Repository**.

---

## **4. Lab Setup and Environment Configuration**

### **4.1 Clone the Repository**

1. **Open Terminal or Command Prompt.**

2. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   ```

   Replace `<repository-url>` with the actual URL of the course repository.

3. **Navigate to the Project Directory:**

   ```bash
   cd SE-241M-SFT7311-6-Lab-Theory-and-Technology-of-Blockchain-Lab
   ```

### **4.2 Install Dependencies**

1. **Backend Dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Contracts Dependencies:**

   ```bash
   cd ../contracts
   npm install
   ```

   Ensure OpenZeppelin contracts and Truffle are installed.

### **4.3 Configure Environment Variables**

1. **Create a `.env` File in the `backend` Directory.**

2. **Add the Following Environment Variables:**

   ```env
   PORT=3000
   INFURA_PROJECT_ID=your_infura_project_id
   MNEMONIC=your_mnemonic_phrase
   NETWORK=rinkeby
   ```

   - **MNEMONIC:** The mnemonic phrase of your Ethereum test account (**use a test account only**).

### **4.4 Set Up Web3.js Connection**

#### **4.4.1 Create `web3.js`**

In the `backend` directory, create a file named `web3.js` with the following content:

```javascript
// backend/web3.js
const Web3 = require('web3');
require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);

const web3 = new Web3(provider);

module.exports = web3;
```

---

## **5. Developing Advanced Solidity Smart Contracts**

### **5.1 Exercise 1: Decentralized Marketplace Contract**

Implement a decentralized marketplace where users can list items for sale, purchase items, and leave reviews. This exercise covers advanced Solidity concepts, including structs, mappings, events, modifiers, and error handling.

#### **5.1.1 Solidity Code: Marketplace.sol**

Create a new Solidity file `Marketplace.sol` in the `contracts` directory:

```solidity
// contracts/Marketplace.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint itemId;
        address payable seller;
        string name;
        string description;
        uint price;
        bool sold;
    }

    struct Review {
        address reviewer;
        uint rating;
        string comment;
    }

    mapping(uint => Item) public items;
    mapping(uint => Review[]) public itemReviews;
    uint public itemCount;

    event ItemListed(uint itemId, address seller, uint price);
    event ItemSold(uint itemId, address buyer);
    event ReviewAdded(uint itemId, address reviewer);

    modifier onlySeller(uint _itemId) {
        require(items[_itemId].seller == msg.sender, "Not the seller");
        _;
    }

    modifier itemExists(uint _itemId) {
        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        _;
    }

    function listItem(string memory _name, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        itemCount++;
        items[itemCount] = Item(itemCount, payable(msg.sender), _name, _description, _price, false);
        emit ItemListed(itemCount, msg.sender, _price);
    }

    function purchaseItem(uint _itemId) public payable itemExists(_itemId) {
        Item storage item = items[_itemId];
        require(msg.value == item.price, "Incorrect value sent");
        require(!item.sold, "Item already sold");
        item.seller.transfer(msg.value);
        item.sold = true;
        emit ItemSold(_itemId, msg.sender);
    }

    function addReview(uint _itemId, uint _rating, string memory _comment) public itemExists(_itemId) {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        itemReviews[_itemId].push(Review(msg.sender, _rating, _comment));
        emit ReviewAdded(_itemId, msg.sender);
    }

    function getReviews(uint _itemId) public view itemExists(_itemId) returns (Review[] memory) {
        return itemReviews[_itemId];
    }
}
```

#### **5.1.2 Explanation**

- **Structs:**
  - `Item`: Represents an item for sale.
  - `Review`: Represents a review for an item.

- **Mappings:**
  - `items`: Stores items by their ID.
  - `itemReviews`: Stores arrays of reviews for each item.

- **Modifiers:**
  - `onlySeller`: Restricts functions to the seller of an item.
  - `itemExists`: Checks if an item exists.

- **Functions:**
  - `listItem`: Allows users to list items for sale.
  - `purchaseItem`: Allows users to purchase items.
  - `addReview`: Allows users to add reviews to items.
  - `getReviews`: Retrieves reviews for an item.

#### **5.1.3 Testing the Contract**

1. **Write Unit Tests in `test/Marketplace.test.js`:**

   ```javascript
   // test/Marketplace.test.js
   const Marketplace = artifacts.require('Marketplace');

   contract('Marketplace', (accounts) => {
     let marketplace;

     before(async () => {
       marketplace = await Marketplace.deployed();
     });

     it('should list an item', async () => {
       await marketplace.listItem('Item 1', 'Description 1', web3.utils.toWei('1', 'Ether'), { from: accounts[0] });
       const item = await marketplace.items(1);
       assert.equal(item.name, 'Item 1', 'Item name is correct');
     });

     it('should purchase an item', async () => {
       const initialSellerBalance = await web3.eth.getBalance(accounts[0]);
       await marketplace.purchaseItem(1, { from: accounts[1], value: web3.utils.toWei('1', 'Ether') });
       const item = await marketplace.items(1);
       assert.equal(item.sold, true, 'Item is marked as sold');
     });

     it('should add a review', async () => {
       await marketplace.addReview(1, 5, 'Great product!', { from: accounts[1] });
       const reviews = await marketplace.getReviews(1);
       assert.equal(reviews.length, 1, 'Review count is correct');
     });
   });
   ```

2. **Run Tests:**

   ```bash
   truffle test
   ```

   Ensure all tests pass successfully.

---

## **6. Implementing the Express.js API Server with Advanced Endpoints**

### **6.1 Initialize the Express Server**

Ensure your `server.js` in the `backend` directory is set up as follows:

```javascript
// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const web3 = require('./web3');
const contract = require('./contract');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Define API routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### **6.2 Defining Advanced RESTful API Endpoints**

Implement the following API endpoints to interact with the Marketplace smart contract:

#### **6.2.1 POST `/listItem`**

Allows a user to list an item for sale.

```javascript
// POST /listItem
app.post('/listItem', async (req, res) => {
  const { sellerAddress, name, description, price } = req.body;

  if (!web3.utils.isAddress(sellerAddress)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  try {
    const tx = contract.methods.listItem(name, description, web3.utils.toWei(price, 'ether'));
    const gas = await tx.estimateGas({ from: sellerAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();

    const nonce = await web3.eth.getTransactionCount(sellerAddress);

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: contract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### **6.2.2 POST `/purchaseItem`**

Allows a user to purchase an item.

```javascript
// POST /purchaseItem
app.post('/purchaseItem', async (req, res) => {
  const { buyerAddress, itemId } = req.body;

  if (!web3.utils.isAddress(buyerAddress)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  try {
    const item = await contract.methods.items(itemId).call();
    const price = item.price;

    const tx = contract.methods.purchaseItem(itemId);
    const gas = await tx.estimateGas({ from: buyerAddress, value: price });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();

    const nonce = await web3.eth.getTransactionCount(buyerAddress);

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: contract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        value: price,
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### **6.2.3 POST `/addReview`**

Allows a user to add a review to an item.

```javascript
// POST /addReview
app.post('/addReview', async (req, res) => {
  const { reviewerAddress, itemId, rating, comment } = req.body;

  if (!web3.utils.isAddress(reviewerAddress)) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  try {
    const tx = contract.methods.addReview(itemId, rating, comment);
    const gas = await tx.estimateGas({ from: reviewerAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();

    const nonce = await web3.eth.getTransactionCount(reviewerAddress);

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: contract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### **6.2.4 GET `/getItem/:itemId`**

Retrieves item details.

```javascript
// GET /getItem/:itemId
app.get('/getItem/:itemId', async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const item = await contract.methods.items(itemId).call();
    res.json({
      itemId: item.itemId,
      seller: item.seller,
      name: item.name,
      description: item.description,
      price: web3.utils.fromWei(item.price, 'ether'),
      sold: item.sold,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### **6.2.5 GET `/getReviews/:itemId`**

Retrieves reviews for an item.

```javascript
// GET /getReviews/:itemId
app.get('/getReviews/:itemId', async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const reviews = await contract.methods.getReviews(itemId).call();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## **7. Deploying and Testing the Smart Contract**

### **7.1 Compiling the Contract**

```bash
truffle compile
```

### **7.2 Deploying to Rinkeby**

1. **Update `truffle-config.js`:**

   ```javascript
   // truffle-config.js
   const HDWalletProvider = require('@truffle/hdwallet-provider');
   require('dotenv').config();

   module.exports = {
     networks: {
       rinkeby: {
         provider: () =>
           new HDWalletProvider(
             process.env.MNEMONIC,
             `https://${process.env.NETWORK}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
           ),
         network_id: 4,
         gas: 5500000,
         confirmations: 2,
         timeoutBlocks: 200,
         skipDryRun: true,
       },
     },
     compilers: {
       solc: {
         version: '0.8.0',
       },
     },
   };
   ```

2. **Deploy the Contract:**

   ```bash
   truffle migrate --network rinkeby
   ```

3. **Update `.env` with Contract Address:**

   After deployment, update your `.env` file:

   ```env
   CONTRACT_ADDRESS=0xYourMarketplaceContractAddress
   ```

### **7.3 Updating `contract.js`**

Ensure `contract.js` is pointing to the correct contract:

```javascript
// backend/contract.js
const web3 = require('./web3');
const contractABI = require('../build/contracts/Marketplace.json').abi;
const contractAddress = process.env.CONTRACT_ADDRESS;

const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = contract;
```

---

## **8. Testing the API Endpoints**

### **8.1 Starting the Server**

Run the Express.js server:

```bash
node server.js
```

Ensure the server is running without errors.

### **8.2 Testing with Postman**

#### **8.2.1 POST `/listItem`**

- **Request:**

  ```http
  POST http://localhost:3000/listItem
  Content-Type: application/json

  {
    "sellerAddress": "0xYourEthereumAddress",
    "name": "Laptop",
    "description": "A high-end gaming laptop",
    "price": "2" // Price in Ether
  }
  ```

- **Expected Response:**

  ```json
  {
    "transactionHash": "0xTransactionHash"
  }
  ```

#### **8.2.2 GET `/getItem/:itemId`**

- **Request:**

  ```http
  GET http://localhost:3000/getItem/1
  ```

- **Expected Response:**

  ```json
  {
    "itemId": "1",
    "seller": "0xYourEthereumAddress",
    "name": "Laptop",
    "description": "A high-end gaming laptop",
    "price": "2",
    "sold": false
  }
  ```

#### **8.2.3 POST `/purchaseItem`**

- **Request:**

  ```http
  POST http://localhost:3000/purchaseItem
  Content-Type: application/json

  {
    "buyerAddress": "0xBuyerEthereumAddress",
    "itemId": 1
  }
  ```

- **Expected Response:**

  ```json
  {
    "transactionHash": "0xPurchaseTransactionHash"
  }
  ```

#### **8.2.4 POST `/addReview`**

- **Request:**

  ```http
  POST http://localhost:3000/addReview
  Content-Type: application/json

  {
    "reviewerAddress": "0xBuyerEthereumAddress",
    "itemId": 1,
    "rating": 5,
    "comment": "Excellent product!"
  }
  ```

- **Expected Response:**

  ```json
  {
    "transactionHash": "0xReviewTransactionHash"
  }
  ```

#### **8.2.5 GET `/getReviews/:itemId`**

- **Request:**

  ```http
  GET http://localhost:3000/getReviews/1
  ```

- **Expected Response:**

  ```json
  [
    {
      "reviewer": "0xBuyerEthereumAddress",
      "rating": "5",
      "comment": "Excellent product!"
    }
  ]
  ```

### **8.3 Verification**

- **Check Transaction Status:**

  - Use [Rinkeby Etherscan](https://rinkeby.etherscan.io/) to verify transactions.

- **Confirm State Changes:**

  - Ensure the item's `sold` status is updated after purchase.
  - Verify that reviews are correctly added and retrieved.

---

## **9. Lab Report Guidelines**

Prepare a comprehensive lab report including:

### **9.1 Introduction**

- State the lab objectives and their significance.

### **9.2 Methodology**

- **Environment Setup:**

  - Describe tools and configurations.

- **Smart Contract Development:**

  - Explain the Marketplace contract, its functions, and design choices.

- **API Implementation:**

  - Detail each API endpoint and how it interacts with the smart contract.

- **Testing Procedures:**

  - Explain how you conducted unit tests and API tests.

### **9.3 Results**

- Present test results, including screenshots of Postman requests and responses.

- Discuss observations and any discrepancies.

### **9.4 Discussion**

- **Challenges Faced:**

  - Detail any issues and how you resolved them.

- **Security Considerations:**

  - Discuss measures taken to secure the application.

### **9.5 Conclusion**

- Summarize findings and learning outcomes.

### **9.6 References**

- List all sources used.

### **9.7 Appendix**

- Include code snippets or links to the GitHub repository.

---

## **10. Submission Instructions**

- **Deadline:** Next laboratory session.

- **Submission Method:** Upload the PDF report to the GitHub repository.

- **File Naming Convention:** `Lab4_Report_<YourName>.pdf`

---

## **11. Evaluation Criteria**

- **Implementation (40%)**

  - Correctness and functionality of the smart contract and API endpoints.

- **Testing and Validation (20%)**

  - Comprehensive testing with documented evidence.

- **Report Quality (20%)**

  - Clarity, organization, and adherence to guidelines.

- **Code Quality (10%)**

  - Clean, well-documented code following best practices.

- **Understanding (10%)**

  - Demonstrated comprehension of concepts and techniques.

---

## **12. Additional Notes**

- **Ethical Considerations:**

  - Do not expose private keys or sensitive information.

- **Collaboration Policy:**

  - Individual work unless otherwise specified.

- **Support:**

  - Contact the instructor for assistance.

---

## **13. Additional Resources**

- **Solidity Documentation:** [docs.soliditylang.org](https://docs.soliditylang.org/)
- **Truffle Suite:** [trufflesuite.com/docs](https://www.trufflesuite.com/docs)
- **Web3.js Documentation:** [web3js.readthedocs.io](https://web3js.readthedocs.io/)
- **Express.js Documentation:** [expressjs.com](https://expressjs.com/)
- **Mocha Testing Framework:** [mochajs.org](https://mochajs.org/)
- **Chai Assertion Library:** [chaijs.com](https://www.chaijs.com/)

---
