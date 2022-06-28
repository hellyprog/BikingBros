// contracts/BikeToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BikeToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    address private _treasuryAddress;

    constructor(uint256 initialSupply) ERC20("BikingBros", "BIKE") ERC20Permit("BikingBros") {
        _mint(msg.sender, initialSupply);
    }

    function transactionFeePercentage() public pure returns (uint) {
        return 2;
    }

    function setTreasuryAddress(address newTreasuryAddress) public onlyOwner {
        _treasuryAddress = newTreasuryAddress;
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        require(to != address(0));
        require(amount <= balanceOf(msg.sender));

        uint fee = SafeMath.div(SafeMath.mul(amount, 2), 100);
        uint taxedValue = SafeMath.sub(amount, fee);

        super.transfer(to, taxedValue);
        super.transfer(_treasuryAddress, fee);
        return true;
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}