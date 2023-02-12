// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface IBet is IERC20 {
    function mintFromLogic(address to, uint256 amount) external;

    function buy(uint256 amount) external;

}
