// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../Logic.sol";

contract OracleMock is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    Logic logic;

    constructor(address logic_) {
        _setupRole(ADMIN_ROLE, msg.sender);
        logic = Logic(logic_);
    }

    function fulfillRequestInfo(uint256[] memory matchId, uint8[] memory winner)
    public
    {
        logic.updateMatches(matchId, winner);
    }

    function clientRequest(uint256 matchId_) public {
        require(msg.sender == address(logic));

        uint8[] memory score = new uint8[](1);
        uint8 score_ = 1;
        // uint8((block.timestamp % 3) + 1);
        score[0] = score_;

        uint256[] memory matchId = new uint256[](1);
        matchId[0] = matchId_;

        fulfillRequestInfo(matchId, score);
    }

    function addAdmin(address admin) public onlyRole(ADMIN_ROLE) {
        _setupRole(ADMIN_ROLE, admin);
    }
}
