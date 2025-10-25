// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RecipeManager is Ownable {
    struct Recipe {
        uint256 id;
        string name;
        uint256[] requiredItemIds;
        string resultName;
        string resultGameOrigin;
        string resultRarity;
        uint256 resultPower;
        string resultTokenURI;
        bool isActive;
    }
    
    mapping(uint256 => Recipe) public recipes;
    uint256 public recipeCount;
    
    event RecipeCreated(uint256 indexed recipeId, string name);
    
    constructor() Ownable(msg.sender) {}
    
    function createRecipe(
        string memory name,
        uint256[] memory requiredItemIds,
        string memory resultName,
        string memory resultGameOrigin,
        string memory resultRarity,
        uint256 resultPower,
        string memory resultTokenURI
    ) public onlyOwner returns (uint256) {
        recipeCount++;
        
        recipes[recipeCount] = Recipe({
            id: recipeCount,
            name: name,
            requiredItemIds: requiredItemIds,
            resultName: resultName,
            resultGameOrigin: resultGameOrigin,
            resultRarity: resultRarity,
            resultPower: resultPower,
            resultTokenURI: resultTokenURI,
            isActive: true
        });
        
        emit RecipeCreated(recipeCount, name);
        return recipeCount;
    }
    
    function getRecipe(uint256 recipeId) public view returns (Recipe memory) {
        return recipes[recipeId];
    }
    
    function getAllRecipes() public view returns (Recipe[] memory) {
        Recipe[] memory allRecipes = new Recipe[](recipeCount);
        for (uint256 i = 1; i <= recipeCount; i++) {
            allRecipes[i - 1] = recipes[i];
        }
        return allRecipes;
    }
}
