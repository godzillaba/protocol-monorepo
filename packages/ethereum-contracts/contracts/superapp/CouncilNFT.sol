pragma solidity >=0.6.0 <0.8.0;


/*
TODO: REMOVE ONLYOWNER FROM _TRANSFER, MODIFY _ISAPPROVEDOROWNER TO ACCOUNT FOR THE DIFFERENT DELEGATING PARTIES

OWNER IS NOT DELEGATOR, IT IS PLATFORM COUNCIL.

CREATE SETDELEGATOR FUNCTION THAT IS ONLYOWNER
    SETS A MAPPING FROM TOKENID -> ADDRESS THAT IS CHECKED IN ISAPPROVEDOROWNER

*/

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract CouncilNFT is ERC721, Ownable {
    mapping (uint256 => address) private _delegators;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}


    modifier isValidAddress(address to) {
        require(to != address(0), "Method called with the zero address");
        _;
    }

    modifier hasNoBalance(address addy) {
        require(balanceOf(addy) == 0, "Destination address already owns a token");
        _;
    }

    function setDelegator(address spender, uint256 tokenId) external onlyOwner {
        _delegators[tokenId] = spender;
    }

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        return spender == _delegators[tokenId];
    }

    function _transfer(address from, address to, uint256 tokenId) internal override isValidAddress(to) isValidAddress(from) hasNoBalance(to) {
        super._transfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal virtual override isValidAddress(to) hasNoBalance(to) onlyOwner {
        super._mint(to, tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override onlyOwner {
        super._burn(tokenId);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}