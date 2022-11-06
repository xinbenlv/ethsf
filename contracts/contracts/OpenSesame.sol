pragma solidity ^0.8.9;

import "../circuits/mimcsponge.sol";
import "hardhat/console.sol";

contract OpenSesame is PlonkVerifier {
    mapping(address=> uint256) playerIds;
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

    function claimWithProof(address _to, bytes memory _proof, uint[] calldata _otherPubSignals) public {
        uint[] memory pubSignals = new uint[](_otherPubSignals.length + 1);

        console.log("msg.sender = %s", msg.sender);
        uint playerId = getPlayerId(msg.sender);
        console.log("playerId = %s", playerId);
        pubSignals[0] = playerId;

        // TODO optimize for gas
        for (uint256 i = 0; i < _otherPubSignals.length; i++) {
            pubSignals[i+1] = _otherPubSignals[i];
        }
        console.log("PlayerId = %s", playerId);
        console.log("pubSignals[0] = %s", pubSignals[0]);
        console.log("pubSignals[1] = %s", pubSignals[1]);
        console.log("pubSignals[2] = %s", pubSignals[2]);
        console.log("pubSignals[3] = %s", pubSignals[3]);

        require(this.verifyProof(_proof, pubSignals), "Proof verification failed");
        _sendEthViaCall(payable(_to));
    }

    function _sendEthViaCall(address payable _to) internal {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: address(this).balance }("");
        require(sent, "Failed to send Ether");
    }
}
