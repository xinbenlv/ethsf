// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
// Registry
import '@ensdomains/ens-contracts/contracts/registry/ENS.sol';
import '@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol';
import '@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol';

contract TheResolver {
    // Same address for Mainet, Ropsten, Rinkerby, Gorli and other networks;
    ENS ens = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);

    function resolve(bytes32 node) public view returns(address) {
        Resolver resolver;
        resolver = Resolver(ens.resolver(node));
        return resolver.addr(node);
    }
}
