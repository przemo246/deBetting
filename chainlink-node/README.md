# Chainlink node module
Comprehensive source to run a chainlink module with example external adapter.
In order to use the adapter, you have to deploy your own oracle and client contract. More guides here:

- https://www.youtube.com/watch?v=TjG14J38M2A&t=3911s
- https://www.youtube.com/watch?v=DO3O6ZUtwbs

>NOTE: You have to top up your node address with ethers >= 0.1ETH and your client contract with LINK >=1 

> NOTE: Node is configured for Goerli network.

> CAUTION: use Alchemy API!


> Do not forget to approve your node address with oracle smartcontract (setAuthorizedSenders function)