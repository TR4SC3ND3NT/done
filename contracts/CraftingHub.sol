// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ItemFactory.sol";
import "./RecipeManager.sol";

contract CraftingHub {
    ItemFactory public itemFactory;
    RecipeManager public recipeManager;
    
    event ItemCrafted(
        address indexed crafter,
        uint256 indexed recipeId,
        uint256 newItemId
    );
    
    constructor(address _itemFactory, address _recipeManager) {
        itemFactory = ItemFactory(_itemFactory);
        recipeManager = RecipeManager(_recipeManager);
    }
    
    function craft(uint256 recipeId, uint256[] memory itemIds) public returns (uint256) {
        RecipeManager.Recipe memory recipe = recipeManager.getRecipe(recipeId);
        require(recipe.isActive, "Recipe not active");
        require(itemIds.length == recipe.requiredItemIds.length, "Wrong number of items");
        
        // Проверяем владение предметами
        for (uint256 i = 0; i < itemIds.length; i++) {
            require(
                itemFactory.ownerOf(itemIds[i]) == msg.sender,
                "Not owner of required item"
            );
        }
        
        // Сжигаем использованные предметы
        for (uint256 i = 0; i < itemIds.length; i++) {
            itemFactory.burn(itemIds[i]);
        }
        
        // Создаем новый предмет
        uint256 newItemId = itemFactory.mint(
            msg.sender,
            recipe.resultName,
            recipe.resultGameOrigin,
            recipe.resultRarity,
            recipe.resultPower,
            recipe.resultTokenURI
        );
        
        emit ItemCrafted(msg.sender, recipeId, newItemId);
        return newItemId;
    }
}
