import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import UserDataStorageABI from './abi/UserDataStorage.json';
import { getInstance, provider, getTokenSignature } from './utils/fhevm';
import { toHexString } from './utils/utils';

let instance;
const userDataStorageAddress = '0xC0204113CcC43D83De06191C082ea696C65466f9';

const KYCProvider = () => {
  const [age, setAge] = useState('');
  const [defiProperty, setDefiProperty] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [loading, setLoading] = useState('');
  const [dialog, setDialog] = useState('');

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
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Store User Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">User Address</label>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
            placeholder="0x..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">DeFi Property</label>
          <input
            type="number"
            value={defiProperty}
            onChange={(e) => setDefiProperty(e.target.value)}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
      {loading && <div>{loading}</div>}
      {dialog && <div>{dialog}</div>}
    </div>
  );
};

export default KYCProvider;
