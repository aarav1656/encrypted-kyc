// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity >=0.8.13 <0.9.0;

import "fhevm/lib/TFHE.sol";
import "./UserDataStorage.sol";

contract UserConditionChecker {
    UserDataStorage private dataStorage;

    constructor(address _dataStorage) {
        dataStorage = UserDataStorage(_dataStorage);
    }

    function isUserAgeAbove18(address user) external view returns (bool) {
        UserDataStorage.EncryptedData memory data = dataStorage.getUserData(user);
        ebool isAbove18Encrypted = TFHE.gt(data.age, TFHE.asEuint16(18));
        return TFHE.decrypt(isAbove18Encrypted);
    }

    function isUserDefiPropertyAbove10000(address user) external view returns (bool) {
        UserDataStorage.EncryptedData memory data = dataStorage.getUserData(user);
        ebool isAbove10000Encrypted = TFHE.gt(data.defiProperty, TFHE.asEuint32(10000));
        return TFHE.decrypt(isAbove10000Encrypted);
    }

    function isUserAgeAndDefiPropertyAbove(address user, uint16 ageThreshold, uint256 defiPropertyThreshold) 
        external 
        view 
        returns (bool, bool) 
    {
        UserDataStorage.EncryptedData memory data = dataStorage.getUserData(user);
        ebool isAgeAboveEncrypted = TFHE.gt(data.age, TFHE.asEuint16(ageThreshold));
        ebool isDefiPropertyAboveEncrypted = TFHE.gt(data.defiProperty, TFHE.asEuint32(defiPropertyThreshold));
        return (TFHE.decrypt(isAgeAboveEncrypted), TFHE.decrypt(isDefiPropertyAboveEncrypted));
    }
}
