import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import UserConditionCheckerABI from './abi/UserConditionChecker.json';
import UserDataStorageABI from './abi/UserDataStorage.json';
import { getInstance, provider } from './utils/fhevm';

let instance;
const userConditionCheckerAddress = '0x28d0F2353af7e357Eed9f960D1D2213Fa85a270e';
const dataStorageAddress = '0xC0204113CcC43D83De06191C082ea696C65466f9';

const DeFiEligibility = () => {
  const [userAddress, setUserAddress] = useState('');
  const [ageAbove18, setAgeAbove18] = useState(null);
  const [defiPropertyAbove10000, setDefiPropertyAbove10000] = useState(null);
  const [customEligibility, setCustomEligibility] = useState({ age: null, defiProperty: null });
  const [ageThreshold, setAgeThreshold] = useState('');
  const [defiPropertyThreshold, setDefiPropertyThreshold] = useState('');
  const [loading, setLoading] = useState('');
  const [dialog, setDialog] = useState('');

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  const handleCheckEligibility = async () => {
    if (!userAddress) {
      alert('Please enter a user address');
      return;
    }

    try {
      const signer = await provider.getSigner();

      const userConditionChecker = new Contract(userConditionCheckerAddress, UserConditionCheckerABI, signer);
      const dataStorage = new Contract(dataStorageAddress, UserDataStorageABI, signer);

      setLoading('Checking age eligibility...');
      const ageAbove18Result = await userConditionChecker.isUserAgeAbove18(userAddress);
      setAgeAbove18(ageAbove18Result);

      setLoading('Checking DeFi property eligibility...');
      const defiPropertyAbove10000Result = await userConditionChecker.isUserDefiPropertyAbove10000(userAddress);
      setDefiPropertyAbove10000(defiPropertyAbove10000Result);

      if (ageThreshold && defiPropertyThreshold) {
        setLoading('Checking custom eligibility...');
        const customEligibilityResult = await userConditionChecker.isUserAgeAndDefiPropertyAbove(
          userAddress,
          ageThreshold,
          defiPropertyThreshold
        );
        setCustomEligibility({ age: customEligibilityResult[0], defiProperty: customEligibilityResult[1] });
      }

      setLoading('');
    } catch (error) {
      console.error(error);
      setLoading('');
      setDialog('Failed to check eligibility');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Check DeFi Eligibility</h2>
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
      <button onClick={handleCheckEligibility} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        Check Eligibility
      </button>

      {loading && <div>{loading}</div>}
      {dialog && <div>{dialog}</div>}

      {ageAbove18 !== null && (
        <div className="mt-4">
          <p>Age above 18: {ageAbove18 ? 'Yes' : 'No'}</p>
        </div>
      )}
      {defiPropertyAbove10000 !== null && (
        <div className="mt-4">
          <p>DeFi Property above 10000: {defiPropertyAbove10000 ? 'Yes' : 'No'}</p>
        </div>
      )}
      <div className="mt-4">
        <label className="block text-gray-700">Age Threshold</label>
        <input
          type="number"
          value={ageThreshold}
          onChange={(e) => setAgeThreshold(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
        />
      </div>
      <div className="mt-4">
        <label className="block text-gray-700">DeFi Property Threshold</label>
        <input
          type="number"
          value={defiPropertyThreshold}
          onChange={(e) => setDefiPropertyThreshold(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
        />
      </div>
      {customEligibility.age !== null && customEligibility.defiProperty !== null && (
        <div className="mt-4">
          <p>Custom Age Eligibility: {customEligibility.age ? 'Yes' : 'No'}</p>
          <p>Custom DeFi Property Eligibility: {customEligibility.defiProperty ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default DeFiEligibility;
