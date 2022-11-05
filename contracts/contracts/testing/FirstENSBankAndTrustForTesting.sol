// SPDX-License-Identifier: UNLICENSED
// ALL CODE HERE IS FOR A HACKATHON AND IS NOT MEANT TO BE USED IN PRODUCTION

pragma solidity ^0.8.9;
// Registry
import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "./FakeENS.sol";
import "../FirstENSBankAndTrust.sol";

contract FirstENSBankAndTrustForTesting is FakeENS, FirstENSBankAndTrust {
    function getENS() internal override view returns (ENS) {
        return this;
    }
}
