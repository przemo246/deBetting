// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IBet.sol";

interface IDAI {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external;
}

contract BetMock is IBet, ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    IERC20 dai;

    uint256 constant PRICE = 1;

    constructor(
        address _dai,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _setupRole(ADMIN_ROLE, msg.sender);
        dai = IERC20(_dai);
    }

    function mintFromLogic(address to, uint256 amount)
        public
        nonReentrant
        onlyRole(ADMIN_ROLE)
    {
        _mint(to, amount);
    }

    function buy(uint256 amount) public nonReentrant {
        dai.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }

    function addAdmin(address admin) public onlyRole(ADMIN_ROLE) {
        _setupRole(ADMIN_ROLE, admin);
    }
}
