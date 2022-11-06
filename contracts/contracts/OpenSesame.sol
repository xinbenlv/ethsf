pragma solidity ^0.8.9;

import "../circuits/mimcsponge.sol";
import "hardhat/console.sol";

contract OpenSesame is PlonkVerifier {
    constructor() payable { }
    receive() external payable {}

    function claimWithProof(address _to, bytes memory _proof, uint[] memory _pubSignals) public {
        require(this.verifyProof(_proof, _pubSignals));
        _sendEthViaCall(payable(_to));
    }

    function _sendEthViaCall(address payable _to) internal {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: address(this).balance }("");
        require(sent, "Failed to send Ether");
    }
}
