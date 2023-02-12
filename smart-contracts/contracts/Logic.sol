// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./oracle/ConsumerContract.sol";

import "hardhat/console.sol";
import "./interfaces/IBet.sol";
import "./interfaces/IYearnInvestor.sol";

contract Logic is ILogic, AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER");

    struct Match {
        uint256 timeStart; // default timestamp type in solidity
        uint256 teamA;
        uint256 teamB;
        uint8 matchResult; // 0 - no result, 1 - won team A, 2 - won team B, 3 - draw
    }

    struct Bet {
        address user;
        uint8 bet; // 0-inactive, 1- won team A, 2-won team B, 3 - draw
        uint256 stake;
    }

    mapping(uint256 => Bet[]) public bets;
    mapping(uint256 => Match) public matches;

    event MatchAdded(uint256, Match);
    event BetPlaced(uint256, Bet);
    event Message(string msg);
    event MatchUpdated(uint256[] matchIds);

    IERC20 DAI;
    IBet betToken;
    ConsumerContract client;
    IYearnInvestor investor;

    constructor(
        address dai,
        address token_,
        address investor_
    ) {
        _setupRole(ADMIN_ROLE, msg.sender);
        DAI = IERC20(dai);
        betToken = IBet(token_);
        investor = IYearnInvestor(investor_);
    }

    function addMatch(
        uint256 matchId,
        uint256 timeStart,
        uint256 teamA,
        uint256 teamB
    ) public nonReentrant {
        require(
            matches[matchId].timeStart == 0 &&
                matches[matchId].teamA == 0 &&
                matches[matchId].teamB == 0 &&
                matches[matchId].matchResult == 0
        );

        require(timeStart > block.timestamp);
        require(teamA != 0);
        require(teamB != 0);

        matches[matchId] = Match({
            timeStart: timeStart,
            teamA: teamA,
            teamB: teamB,
            matchResult: 0
        });

        emit MatchAdded(matchId, matches[matchId]);
    }

    function placeBet(
        uint256 matchId,
        uint8 bet,
        uint256 stake
    ) public nonReentrant canBet(matchId, msg.sender) {
        require(stake > 0);
        require(DAI.allowance(msg.sender, address(this)) >= stake);

        DAI.transferFrom(msg.sender, address(this), stake);
        DAI.approve(address(investor), stake);
        investor.depositFromLogic(stake);

        Bet memory b = Bet({user: msg.sender, bet: bet, stake: stake});

        bets[matchId].push(b);
        emit BetPlaced(matchId, b);
    }

    function checkBet(uint256 matchId, address user)
        public
        nonReentrant
        matchEnded(matchId)
        returns (uint256)
    {
        if (matches[matchId].matchResult == 0) {
            requestUpdateMatch(matchId);
            return 0;
        }
        require(user != address(0));

        Bet memory bet = getBet(matchId, user);

        if (matches[matchId].matchResult == bet.bet) {
            uint256 withdrawable = (calculateTotalStake(matchId) * bet.stake) /
                calculateWinningStake(matchId);

            removeBet(matchId, user);

            investor.withdrawBet(user, withdrawable);

            betToken.mintFromLogic(user, 1 ether);

            if (betToken.balanceOf(user) >= 1000 ether) {
                withdrawable += investor.withdrawBoost(user);
            }

            return withdrawable;
        }
        return 0;
    }

    function getBet(uint256 matchId, address user)
        public
        view
        returns (Bet memory)
    {
        for (uint256 i = 0; i < bets[matchId].length; i++) {
            if (bets[matchId][i].user == user) {
                return bets[matchId][i];
            }
        }
        revert("Bet not found");
    }

    function removeBet(uint256 matchId, address user) private {
        for (uint256 i = 0; i < bets[matchId].length; i++) {
            if (bets[matchId][i].user == user) {
                bets[matchId][i].user = address(0);
                return;
            }
        }
        revert("Bet not found");
    }

    function calculateTotalStake(uint256 matchId)
        public
        view
        returns (uint256 total)
    {
        total = 0;
        for (uint256 i = 0; i < bets[matchId].length; i++) {
            total += bets[matchId][i].stake;
        }
    }

    function calculateWinningStake(uint256 matchId)
        public
        view
        returns (uint256 total)
    {
        total = 0;
        uint8 result = matches[matchId].matchResult;
        for (uint256 i = 0; i < bets[matchId].length; i++) {
            if (bets[matchId][i].bet == result) {
                total += bets[matchId][i].stake;
            }
        }
    }

    function requestUpdateMatch(uint256 matchId) private {
        client.clientRequest(matchId);
    }

    function updateMatches(
        uint256[] calldata matchIds,
        uint8[] calldata matchResults
    ) public override onlyRole(CONSUMER_ROLE) {
        require(matchIds.length == matchResults.length);

        for (uint8 i = 0; i < matchIds.length; i++) {
            matches[matchIds[i]].matchResult = matchResults[i];
        }
        emit MatchUpdated(matchIds);
    }

    function setupConsumer(address consumer_) public onlyRole(ADMIN_ROLE) {
        require(consumer_ != address(0));
        _setupRole(CONSUMER_ROLE, consumer_);
        client = ConsumerContract(consumer_);
    }

    function matchExists(uint256 matchId) public view returns (bool) {
        return matches[matchId].timeStart != 0;
    }

    function betExists(uint256 matchId, address user)
        public
        view
        returns (bool)
    {
        for (uint256 i = 0; i < bets[matchId].length; i++) {
            if (bets[matchId][i].user == user) {
                return true;
            }
        }
        return false;
    }

    modifier canBet(uint256 matchId, address user) {
        require(matchExists(matchId), "Match does not exist");
        require(
            matches[matchId].timeStart > block.timestamp,
            "Cannot bet on this match"
        );
        for (uint i = 0; i < bets[matchId].length; i++) {
            require(bets[matchId][i].user != user, "Bet already placed");
        }
        _;
    }

    modifier matchEnded(uint256 matchId) {
        // assuming a match lasts 2hrs
        require(matchExists(matchId), "match does not exist");
        require(
            matches[matchId].timeStart + 7200 < block.timestamp,
            "match not finished yet"
        );
        _;
    }
}
