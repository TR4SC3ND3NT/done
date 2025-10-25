// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ItemFactory is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    struct Item {
        string name;
        string gameOrigin;
        string rarity;
        uint256 power;
    }
    
    mapping(uint256 => Item) public items;
    
    event ItemMinted(
        address indexed to,
        uint256 indexed tokenId,
        string name,
        string gameOrigin
    );
    
    constructor() ERC721("CrossGameItem", "XGI") Ownable(msg.sender) {}
    
    function mint(
        address to,
        string memory name,
        string memory gameOrigin,
        string memory rarity,
        uint256 power,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        items[newTokenId] = Item({
            name: name,
            gameOrigin: gameOrigin,
            rarity: rarity,
            power: power
        });
        
        emit ItemMinted(to, newTokenId, name, gameOrigin);
        return newTokenId;
    }
    
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized");
        _burn(tokenId);
    }
    
    function getItem(uint256 tokenId) public view returns (Item memory) {
        return items[tokenId];
    }
}
