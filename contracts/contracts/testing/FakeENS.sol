// SPDX-License-Identifier: UNLICENSED
// ALL CODE HERE IS FOR A HACKATHON AND IS NOT MEANT TO BE USED IN PRODUCTION

pragma solidity ^0.8.9;
// Registry
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";


contract FakeENS is ENS {

    function setRecord(
        bytes32 node,
        address owner,
        address resolver,
        uint64 ttl
    ) external {}

    function setSubnodeRecord(
        bytes32 node,
        bytes32 label,
        address owner,
        address resolver,
        uint64 ttl
    ) external {}

    function setSubnodeOwner(
        bytes32 node,
        bytes32 label,
        address owner
    ) external returns (bytes32) {}

    function setResolver(bytes32 node, address resolver) external {}

    function setOwner(bytes32 node, address owner) external {}

    function setTTL(bytes32 node, uint64 ttl) external {}

    function setApprovalForAll(address operator, bool approved) external {}

    function owner(bytes32 node) external view returns (address) {
        return 0x0000000000000000000000000000000000000000;
    }

    function resolver(bytes32 node) external view returns (address) {
        return 0x0000000000000000000000000000000000000000;
    }

    function ttl(bytes32 node) external view returns (uint64) {
        return 0xffffffffffffffff;
    }

    function recordExists(bytes32 node) external view returns (bool) {
        return true;
    }

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool) {
            return true;
    }
}
