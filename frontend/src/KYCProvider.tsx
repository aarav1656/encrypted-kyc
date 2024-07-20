import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import UserDataStorageABI from './abi/UserDataStorage.json';
import { getInstance, provider, getTokenSignature } from './utils/fhevm';
import { toHexString } from './utils/utils';
import confidentialDIDABI from "./abi/confidentialDIDABI.json";

let instance;
const userDataStorageAddress = '0xC0204113CcC43D83De06191C082ea696C65466f9';
const CREDIT_CONTRACT_ADDRESS = "0x9fF4097E6d4052dAfa4EF7B36AaC8127EBa97372";

const KYCProvider = () => {
  const [age, setAge] = useState('');
  const [defiProperty, setDefiProperty] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState('');
  const [dialog, setDialog] = useState('');

  // kyc provider stores credit score for users

  const [creditScore, setCreditScore] = useState(0);
  const [isAbove700, setIsAbove700] = useState("Click Below");
  const [encryptedData, setEncryptedData] = useState("");
  const [userCreditScore, setUserCreditScore] = useState("hidden");

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  const handleCreditScoreChange = (e) => {
    setCreditScore(Number(e.target.value));
    if (instance) {
      const encrypted = instance.encrypt16(Number(e.target.value));
      setEncryptedData(toHexString(encrypted));
    }
  };

  const storeCreditScore = async (event) => {
    event.preventDefault();
    try {
      const signer = await provider.getSigner();
      const contract = new Contract(
        CREDIT_CONTRACT_ADDRESS,
        confidentialDIDABI,
        signer
      );
      setLoading('Encrypting "30" and generating ZK proof...');
      setLoading("Sending transaction...");
      const transaction = await contract.storeDemo(
        "0x" + encryptedData,
        { gasLimit: 1000000 }
      );
      setLoading("Waiting for transaction validation...");
      await provider.waitForTransaction(transaction.hash);
      setLoading("");
      setDialog("Credit Score has been stored!");
      console.log('txHash', transaction.hash);
    } catch (e) {
      console.log(e);
      setLoading("");
      setDialog("Transaction error!");
    }
  };


  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!age || !defiProperty || !userAddress) {
      alert('Please fill all fields');
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new Contract(userDataStorageAddress, UserDataStorageABI, signer);

      const encryptedAge = toHexString(instance.encrypt16(Number(age)));
      const encryptedDefiProperty = toHexString(instance.encrypt32(Number(defiProperty)));

      setLoading('Encrypting data and generating ZK proof...');
      const transaction = await contract.storeUserData(userAddress, `0x${encryptedAge}`, `0x${encryptedDefiProperty}`, { gasLimit: 1000000 });
      setLoading('Sending transaction...');
      await provider.waitForTransaction(transaction.hash);
      setLoading('');
      setDialog('User data stored successfully!');
      console.log('txHash', transaction.hash);
    } catch (error) {
      console.error(error);
      setLoading('');
      setDialog('Failed to store user data');
    }
  };

  return (
    <>
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Store User Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">User Address</label>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="mt-2 p-2 border rounded w-full text-white"
            placeholder="0x..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-2 p-2 border rounded w-full text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">DeFi Property</label>
          <input
            type="number"
            value={defiProperty}
            onChange={(e) => setDefiProperty(e.target.value)}
            className="mt-2 p-2 border rounded w-full text-white"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
      {loading && <div>{loading}</div>}
      {dialog && <div>{dialog}</div>}
    </div>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg my-6">
          <div className="text-gray-500">
            Store credit score for Users
      </div>
          <br></br>
          <form onSubmit={storeCreditScore}>
            <input
              type="number"
              placeholder="Enter amount to mint"
              value={creditScore}
              onChange={handleCreditScoreChange}
              className="border rounded-md px-4 py-2 mb-1 bg-white"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
            >
              Set Credit Score
            </button>
          </form>
          {encryptedData && (
            <div className="text-gray-500">
              <p>Generated Ciphertext:</p>
              <div className="overflow-y-auto h-10 flex flex-col">
                <p>{"0x" + encryptedData.substring(0, 26) + "..."}</p>
              </div>
            </div>
          )}
        </div>
        </>
  );
};

export default KYCProvider;
