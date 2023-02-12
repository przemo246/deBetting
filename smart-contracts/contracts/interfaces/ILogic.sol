// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface ILogic {
    function updateMatches(
        uint256[] calldata matchIds,
        uint8[] calldata matchResults
    ) external;
}
