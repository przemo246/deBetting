// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IYearnInvestor {
    function depositFromLogic(uint256 amount) external;

    function depositFromToken(uint256 amount) external;

    function withdrawBet(address to, uint256 amount) external;

    function withdrawBoost(address to) external returns (uint256);

    function withdrawYieldAdmin() external;

    function withdrawAll() external;

    function balance() external view returns (uint256);

    function addAdmin(address admin) external;

}
