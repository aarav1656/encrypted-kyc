// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity >=0.8.13 <0.9.0;

import "fhevm/abstracts/EIP712WithModifier.sol";

import "fhevm/lib/TFHE.sol";

contract UserDataStorage is EIP712WithModifier {
    address public trustedDataProvider;

    struct EncryptedData {
        euint16 age;
        euint32 defiProperty;
    }

    mapping(address => EncryptedData) internal userData;

    constructor() EIP712WithModifier("User Data Authorization", "1") {
        trustedDataProvider = msg.sender;
    }

    modifier onlyProvider {
        require(msg.sender == trustedDataProvider, "Caller is not the trusted provider");
        _;
    }

    function storeUserData(address user, bytes calldata encryptedAge, bytes calldata encryptedDefiProperty) 
        external 
        onlyProvider 
    {
        userData[user] = EncryptedData({
            age: TFHE.asEuint16(encryptedAge),
            defiProperty: TFHE.asEuint32(encryptedDefiProperty)
        });
    }

    function getUserData(address user) external view returns (EncryptedData memory) {
        return userData[user];
    }
}
