// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract InvestorMock is AccessControl, ReentrancyGuard {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    bytes32 public constant SALE_POOL = keccak256("SALE_POOL");
    bytes32 public constant BET_POOL = keccak256("BET_POOL");


    IERC20 dai;
    IERC20 bet;

    mapping(bytes32 => uint256) pools;


    constructor(address dai_, address bet_) {
        _setupRole(ADMIN_ROLE, msg.sender);
        dai = IERC20(dai_);
        bet = IERC20(bet_);
    }


    function depositFromLogic(uint256 amount) public onlyRole(ADMIN_ROLE) {
        require(dai.allowance(msg.sender, address(this)) >= amount, "Allowance too small");

        dai.transferFrom(msg.sender, address(this), amount);
        pools[BET_POOL] += amount;
    }

    function depositFromToken(uint256 amount) public onlyRole(ADMIN_ROLE) {
        require(dai.allowance(msg.sender, address(this)) >= amount, "Allowance too small");

        dai.transferFrom(msg.sender, address(this), amount);

        pools[SALE_POOL] += amount;
    }

    function withdrawBet(address to, uint256 amount) public onlyRole(ADMIN_ROLE) returns (uint256) {
        require(amount <= pools[BET_POOL], "Amount > pool");

        dai.transfer(to, amount);

        pools[BET_POOL] -= amount;

        return amount;
    }

    function withdrawBoost(address to) public onlyRole(ADMIN_ROLE) returns (uint256) {
        uint256 total = bet.totalSupply();
        uint256 balanceUser = bet.balanceOf(to);
        require(balanceUser >= 1000 ether, "BET balance to small on that address");

        uint256 withdrawable = pools[BET_POOL] + pools[SALE_POOL];
        return ((withdrawable * balanceUser / total));
    }


    function withdrawAll() public onlyRole(ADMIN_ROLE) {
        uint256 balanceShares = dai.balanceOf(address(this));
        pools[SALE_POOL] = 0;
        pools[BET_POOL] = 0;
        dai.transfer(msg.sender, balanceShares);
    }


    function addAdmin(address admin) public {
        _setupRole(ADMIN_ROLE, admin);
    }


}
