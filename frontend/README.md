# Confidential DID Dapp

Store PII (Personally Identifiable Information) such as your credit score on-chain in an encrypted manner. The contract can compare the encrypted credit score with 700. The answer is decrypted and returned as a view function, but the credit score itself is never revealed.

The Solidity contract can be found in [`CreditScorePII.sol`](https://github.com/Inco-fhevm/Contracts/blob/main/inco_contract/CreditScorePII.sol)

## Get Started

Clone the project, then run:

```bash
npm install
npm run dev
```

The dapp should run on http://localhost:5173.
