pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract ERC721ForTesting is ERC721 {
    constructor() ERC721("ERC721ForTesting", "ERC721ForTesting") {}
    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

}
