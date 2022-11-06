pragma solidity ^0.8.9;

import "../circuits/mimcsponge.sol";

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./ENSNamehash.sol";

contract OpenSesame is PlonkVerifier {
    address constant DEFAULT_GLOBAL_ENS = 0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e;
    address constant DEFAULT_ENS_RESOLVER = 0xE264d5bb84bA3b8061ADC38D3D76e6674aB91852;
    string constant DEFAULT_ENS_DOMAIN = "xinbenlvethsf.eth";

    // THIS SHOULD NOT BE USED IN PRODUCTION
    address public ensAddress = DEFAULT_GLOBAL_ENS;
    // THIS SHOULD NOT BE USED IN PRODUCTION
    address public resolverAddress = DEFAULT_ENS_RESOLVER;
    // THIS SHOULD NOT BE USED IN PRODUCTION
    string public ensDomain = DEFAULT_ENS_DOMAIN;

    // THIS SHOULD NOT BE USED IN PRODUCTION
    mapping(address=> uint256) public playerIds;
    mapping(address=> bool) public guruMap;
    mapping(address=> bool) public ensClaimedMap;
    uint256 public playerCount = 0;
    uint256 public playerIdBase = 1;

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

    function claimENS(address _to, string memory _ensName) public {
        require(guruMap[msg.sender], "Only gurus can claim the treasury");
        require(!ensClaimedMap[_to], "ENS already claimed");
        ensClaimedMap[_to] = true;
        _claimENS(_to, _ensName);
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

     function _claimENS(address _to, string memory _ensName) internal {
        ENS ens = ENS(ensAddress);
        ens.setSubnodeRecord(
            ENSNamehash.namehash(bytes(ensDomain)),
            keccak256(abi.encodePacked(_ensName)),
            _to,
            resolverAddress,
            0);
    }

    // THIS IS FOR DEV PURPOSE. IT'S NOT FOP PRODUCTION.
    function setGuruMapDEV(address player, bool isGuru) public {
        guruMap[player] = isGuru;
    }

    // THIS IS FOR DEV PURPOSE. IT'S NOT FOP PRODUCTION.
    function setENSDomainDEV(address _ensAddress, address _resolverAddress, string memory _ensDomain) public {
        ensDomain = _ensDomain;
        ensAddress = _ensAddress;
        resolverAddress = _resolverAddress;
    }

     function claimENSdev(address _to, string memory _ensName) public {
        _claimENS(_to, _ensName);
    }
}
