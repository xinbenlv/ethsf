pragma solidity ^0.8.9;

import "../circuits/mimcsponge.sol";

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./ENSNamehash.sol";

contract OpenSesame is PlonkVerifier {
    address constant DEFAULT_GLOBAL_ENS = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
    address private ensAddress = DEFAULT_GLOBAL_ENS;
    mapping(address=> uint256) playerIds;
    mapping(address=> bool) guruMap;
    mapping(address=> bool) ensClaimedMap;
    uint256 playerCount = 0;
    uint256 playerIdBase = 1;

    constructor() payable {
    }
    receive() external payable {}

    function registerPlayer() public {
        playerIds[msg.sender] = (playerCount + playerIdBase);
        playerCount++;
    }

    function getPlayerId(address player) public view returns (uint256) {
        return playerIds[player];
    }
    function claimTreasury(address _to) public {
        require(guruMap[msg.sender], "Only gurus can claim the treasury");
        payable(_to).transfer(address(this).balance);
    }

    // XXX untested
    // Prerequisite: set controller of `ethguru.eth` to this controller
    // 
    function claimENS(address _to, string memory _ensName) public {
        require(guruMap[msg.sender], "Only gurus can claim the treasury");
        require(!ensClaimedMap[_to], "ENS already claimed");
        ensClaimedMap[_to] = true;
        ENS ens = ENS(ensAddress);
        // ens.setSubnodeOwner(ens.rootNode(), keccak256(abi.encodePacked(_ensName)), _to);
    }

    function guruProof(address _to, bytes memory _proof, uint[] calldata _otherPubSignals) public {
        require(guruMap[msg.sender] == false, "You are already a guru, you can't claim");
        uint[] memory pubSignals = new uint[](_otherPubSignals.length + 1);
        uint playerId = getPlayerId(msg.sender);
        pubSignals[0] = playerId;

        // TODO optimize for gas
        for (uint256 i = 0; i < _otherPubSignals.length; i++) {
            pubSignals[i+1] = _otherPubSignals[i];
        }

        require(this.verifyProof(_proof, pubSignals), "Proof verification failed");
        guruMap[msg.sender] = true;
    }
}
