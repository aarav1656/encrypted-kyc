// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";
import "fhevm/lib/TFHE.sol";

contract KYCAMLData is EIP712WithModifier {
    bytes32 private DOMAIN_SEPARATOR;
    address public trustedKYCProvider;

    mapping(address => bytes) internal kycData;

    constructor() EIP712WithModifier("KYCAML Authorization", "1") {
        trustedKYCProvider = msg.sender;
    }

    modifier onlyProvider {
        require(msg.sender == trustedKYCProvider, "Caller is not the trusted provider");
        _;
    }

    function storeKYCData(address user, bytes calldata encryptedData) external onlyProvider {
        kycData[user] = encryptedData;
    }

    function viewKYCData(address user, bytes32 publicKey, bytes calldata signature) 
        public 
        view 
        onlySignedPublicKey(publicKey, signature) 
        returns (bytes memory) 
    {
        return TFHE.reencrypt(kycData[user], publicKey, 0);
    }
}
