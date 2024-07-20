import React from "react";
import { useState } from "react";

function DeFiEligibility() {
  const [age, setAge] = useState(0);
  const [defiProperty, setDefiProperty] = useState("");
  const [userAge, setUserAge] = useState("hidden");
  const [userDefiProperty, setUserDefiProperty] = useState("hidden");
  const [loading, setLoading] = useState("");
  const [dialog, setDialog] = useState("");

  const handleAgeChange = (e) => {
    setAge(Number(e.target.value));
  };

  const handleDefiPropertyChange = (e) => {
    setDefiProperty(e.target.value);
  };

  return (
    <div className="mt-5">
      <div className="flex flex-col text-center justify-center items-center mb-10 mt-10">
        <img src={"/band.svg"} alt="Band" />
        <h1 className="my-10 text-2xl font-bold text-gray-500">
          Proof of DeFi Eligibility
        </h1>
        <img src={"/band.svg"} alt="Band" />
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col md:w-1/2 p-4">
          <div className="bg-black py-10 px-10 text-left mb-6">
            <div className="text-white">
              Your Age: <span className="text-custom-green">{userAge}</span>
            </div>
            <div className="text-white">
              Your DeFi Property: <span className="text-custom-green">{userDefiProperty}</span>
            </div>
            <button
              className="bg-gray-200 hover:bg-blue-400 text-black font-bold py-2 px-4 rounded mb-8"
              onClick={() => {
                /* Decrypt Eligibility Data Logic */
              }}
            >
              Decrypt Eligibility Data
            </button>
          </div>
          <div className="text-gray-500">
            Your eligibility data should be stored by a third trusted party, but you
            can set it yourself for the demo:
          </div>
          <br></br>
          <form onSubmit={(event) => {
            event.preventDefault();
            /* Store Eligibility Data Logic */
          }}>
            <input
              type="number"
              placeholder="Enter your age"
              value={age}
              onChange={handleAgeChange}
              className="border rounded-md px-4 py-2 mb-1 bg-white"
            />
            <input
              type="text"
              placeholder="Enter DeFi property"
              value={defiProperty}
              onChange={handleDefiPropertyChange}
              className="border rounded-md px-4 py-2 mb-1 bg-white"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
            >
              Set Eligibility Data
            </button>
          </form>
          <div className="text-gray-500">
            {dialog && <div>{dialog}</div>}
            {loading && <div>{loading}</div>}
          </div>
        </div>
        <div className="flex flex-col md:w-1/2 p-4 overflow-y-auto h-96 bg-amber-300">
          <div className="text-lg">Code Snippets:</div>
          <br></br>
          <div className="text-sm">
            The user eligibility data is stored on-chain in an encrypted manner by a trusted third party.
          </div>
          <img src={"/DIDCodeSvg1.svg"} alt="DIDCodeSvg1" />
          <div className="text-sm">
            TFHE.gt can compare the encrypted data with preset values, which the answer is decrypted and returned as a view function.
          </div>
          <img src={"/DIDCodeSvg2.svg"} alt="DIDCodeSvg2" />
          <div className="text-sm">
            Users are able to view their own decrypted eligibility data by signing an EIP-712 signature.
          </div>
          <img src={"/DIDCodeSvg3.svg"} alt="DIDCodeSvg3" />
          <div>
            Smart Contract Implementation:{" "}
            <a
              target="_blank" rel="noreferrer"
              href="https://docs.inco.org/getting-started/example-dapps/confidential-did"
            >
              Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeFiEligibility;
