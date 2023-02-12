// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiMock is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(ADMIN_ROLE, msg.sender);
    }

    function mintFromLogic(address to, uint256 amount)
        public
        nonReentrant
        onlyRole(ADMIN_ROLE)
    {
        _mint(to, amount);
    }

    function addAdmin(address admin) public onlyRole(ADMIN_ROLE) {
        _setupRole(ADMIN_ROLE, admin);
    }
}
