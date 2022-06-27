// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract BikeTreasury is Ownable {
    IERC20 public treasuryToken;

    constructor(address treasuryTokenAddress) {
        treasuryToken = IERC20(treasuryTokenAddress);
    }

    function transfer(address to, uint256 grantAmount) external onlyOwner {
        treasuryToken.transfer(to, grantAmount);
    }
}