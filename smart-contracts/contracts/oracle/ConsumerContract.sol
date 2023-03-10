// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/ILogic.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract ConsumerContract is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY; // 1 * 10**18

    mapping(uint256 => uint8) public matchResultsMapping;
    ILogic logic;

    event RequestForInfoFulfilled(
        bytes32 indexed requestId,
        uint256[] matchId,
        uint8[] winner
    );

    /**
     *  Goerli
     *@dev LINK address in Goerli network: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * @dev Check https://docs.chain.link/docs/link-token-contracts/ for LINK address for the right network
     */
    constructor(address logic_) ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        require(logic_ != address(0));
        logic = ILogic(logic_);
    }

    function requestInfo(
        address _oracle,
        string memory _jobId,
        string memory matchIds
    ) public onlyOwner {
        Chainlink.Request memory req = buildOperatorRequest(
            stringToBytes32(_jobId),
            this.fulfillRequestInfo.selector
        );

        req.add("matchIds", matchIds);
        sendOperatorRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function fulfillRequestInfo(
        bytes32 _requestId,
        uint256[] memory matchId,
        uint8[] memory winner
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestForInfoFulfilled(_requestId, matchId, winner);
        logic.updateMatches(matchId, winner);
    }

    function clientRequest(uint256 matchId) public {
        require(msg.sender == address(logic));
        requestInfo(
            0x2dbDFd16806C9A52A08c61485fc47420Ba6Baed6,
            "049f49add88a4d26b4b7b1f8c76d78ab",
            Strings.toString(matchId)
        );
    }

    /*
    ========= UTILITY FUNCTIONS ==========
    */

    function contractBalances()
    public
    view
    returns (uint256 eth, uint256 link)
    {
        eth = address(this).balance;

        LinkTokenInterface linkContract = LinkTokenInterface(
            chainlinkTokenAddress()
        );
        link = linkContract.balanceOf(address(this));
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer Link"
        );
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    function stringToBytes32(string memory source)
    private
    pure
    returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
        // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }
}
