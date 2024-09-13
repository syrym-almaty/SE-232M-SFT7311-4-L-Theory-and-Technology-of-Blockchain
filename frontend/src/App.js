// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState('');

  useEffect(() => {
    async function loadBlockchainData() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        alert('MetaMask is not installed!');
      }
    }
    loadBlockchainData();
  }, []);

  return (
    <div>
      <h1>Connected Account: {account}</h1>
    </div>
  );
}

export default App;
