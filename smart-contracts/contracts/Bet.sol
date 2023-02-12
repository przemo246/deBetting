// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./interfaces/IYearnInvestor.sol";
import "./interfaces/IBet.sol";

contract Bet is IBet, ERC20, AccessControl, ReentrancyGuard {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    uint256 constant PRICE = 1;

    IERC20 DAI;
    IYearnInvestor investor;


    constructor(address DAI_)
    ERC20("Bet token", "BET"){
        DAI = IERC20(DAI_);
        _setupRole(ADMIN_ROLE, msg.sender);
    }


    function addAdmin(address admin) public onlyRole(ADMIN_ROLE) {
        _setupRole(ADMIN_ROLE, admin);
    }

    function setupInvestor(address investor_) public onlyRole(ADMIN_ROLE) {
        investor = IYearnInvestor(investor_);
    }


    function mintFromLogic(address to, uint256 amount) public nonReentrant onlyRole(ADMIN_ROLE) {
        require(address(0) != to, "Address != 0");
        require(amount > 0, "Amount != 0");
        _mint(to, amount);
    }

    function buy(uint256 amount) public nonReentrant {
        require(amount != 0, "Amount != 0");
        require(DAI.allowance(msg.sender, address(this)) >= amount * PRICE, "Allowance too small");

        DAI.transferFrom(msg.sender, address(this), amount);
        DAI.approve(address(investor), amount);
        investor.depositFromToken(amount);

        _mint(msg.sender, amount);
    }


}
