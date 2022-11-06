pragma solidity ^0.8.9;

import "../circuits/mimcsponge.sol";
import "hardhat/console.sol";

contract OpenSesame is PlonkVerifier {
    constructor() payable { }
    receive() external payable {}


    function claimWithProof(bytes memory proof, uint[] memory pubSignals) public {
        require(this.verifyProof(proof, pubSignals));
        _sendEthViaCall(payable(msg.sender));
    }

    function _sendEthViaCall(address payable _to) internal {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: address(this).balance }("");
        require(sent, "Failed to send Ether");
    }
}
