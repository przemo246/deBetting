// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IYDAI is IERC20 {
    function deposit(uint _amount) external;

    function withdraw(uint _amount) external;

    function balanceOf(address _address) external view returns (uint);

    function pricePerShare() external view returns (uint);

    function performanceFee() external view returns (uint);

    function managementFee() external view returns (uint);
}


contract YearnInvestor is AccessControl, ReentrancyGuard {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    bytes32 public constant SALE_POOL = keccak256("SALE_POOL");
    bytes32 public constant BET_POOL = keccak256("BET_POOL");


    IYDAI yDai;
    IERC20 dai;
    IERC20 bet;

    mapping(bytes32 => uint256) pools;


    constructor(address dai_, address yDai_, address bet_) {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, bet_);
        yDai = IYDAI(yDai_);
        dai = IERC20(dai_);
        bet = IERC20(bet_);
    }


    function depositFromLogic(uint256 amount) public onlyRole(ADMIN_ROLE) {
        require(dai.allowance(msg.sender, address(this)) >= amount, "Allowance too small");

        dai.transferFrom(msg.sender, address(this), amount);
        _deposit(amount);
        pools[BET_POOL] += amount;
    }

    function depositFromToken(uint256 amount) public onlyRole(ADMIN_ROLE) {
        require(dai.allowance(msg.sender, address(this)) >= amount, "Allowance too small");

        dai.transferFrom(msg.sender, address(this), amount);
        _deposit(amount);
        pools[SALE_POOL] += amount;
    }

    function withdrawBet(address to, uint256 amount) public onlyRole(ADMIN_ROLE) returns (uint256) {
        require(amount <= pools[BET_POOL], "Amount > pool");

        pools[BET_POOL] -= amount;
        return (_withdraw(amount, to));
    }

    function withdrawBoost(address to) public onlyRole(ADMIN_ROLE) returns (uint256) {
        uint256 total = bet.totalSupply();
        uint256 balanceUser = bet.balanceOf(to);
        require(balanceUser >= 1000 ether, "BET balance too small on that address");

        uint256 withdrawable = balance() - pools[BET_POOL] - pools[SALE_POOL];
        return (_withdraw(withdrawable * balanceUser / total, to));
    }

    function withdrawYieldAdmin() public onlyRole(ADMIN_ROLE) {
        _withdraw((balance() - pools[SALE_POOL] - pools[BET_POOL]), msg.sender);
    }

    function withdrawAll() public onlyRole(ADMIN_ROLE) {
        uint256 balanceShares = yDai.balanceOf(address(this));
        yDai.withdraw(balanceShares);
        pools[SALE_POOL] = 0;
        pools[BET_POOL] = 0;
        dai.transfer(msg.sender, dai.balanceOf(address(this)));
    }


    function _withdraw(uint256 amount, address to) private nonReentrant returns (uint256 withdrawable) {
        uint256 price = yDai.pricePerShare();
        // yDai withdrawable
        withdrawable = amount * 1e18 / price;
        withdrawable -= (withdrawable * (yDai.managementFee() + yDai.performanceFee()) / 1e18);
        if (withdrawable > 0) {
            yDai.withdraw(withdrawable);
            // dai withdrawable
            withdrawable = dai.balanceOf(address(this));
            dai.transfer(to, withdrawable);
        }
    }

    function _deposit(uint amount) private {
        dai.approve(address(yDai), amount);
        yDai.deposit(amount);
    }

    function balance() public view returns (uint256) {
        uint price = yDai.pricePerShare();
        uint balanceShares = yDai.balanceOf(address(this));
        return balanceShares * price / 1e18;
    }

    function addAdmin(address admin) public {
        _setupRole(ADMIN_ROLE, admin);
    }


}
