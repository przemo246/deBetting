// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract LogicMock {
    address consumer;
    address owner;
    event MatchUpdated(uint256[] matchIds, uint8[] matchResults);

    constructor() {
        owner = msg.sender;
    }

    function setConsumer(address _consumer) public {
        require(msg.sender == owner, "Only owner");
        consumer = _consumer;
    }

    function updateMatches(
        uint256[] calldata matchIds,
        uint8[] calldata matchResults
    ) public {
        require(msg.sender == consumer, "Only consumer");
        emit MatchUpdated(matchIds, matchResults);
    }
}
