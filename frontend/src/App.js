// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import SimpleStorageABI from './abis/SimpleStorage.json';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [storageValue, setStorageValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const contractAddress = SimpleStorageABI.networks[networkId]?.address;
      if (contractAddress) {
        const simpleStorageContract = new web3.eth.Contract(SimpleStorageABI.abi, contractAddress);
        setContract(simpleStorageContract);
      }
    };
    loadBlockchainData();
  }, []);

  const handleSet = async () => {
    if (contract && inputValue) {
      await contract.methods.set(inputValue).send({ from: account });
      alert('Value set successfully');
    }
  };

  const handleGet = async () => {
    if (contract) {
      const value = await contract.methods.get().call();
      setStorageValue(value);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Storage DApp</h1>
        <p>Your Account: {account}</p>
        <div>
          <input
            type="text"
            placeholder="Set a value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSet}>Set Value</button>
        </div>
        <div>
          <button onClick={handleGet}>Get Value</button>
          {storageValue && <p>Stored Value: {storageValue}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
