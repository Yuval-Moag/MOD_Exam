using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroceryListApi.DTOs;
using GroceryListApi.Models;
using GroceryListApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GroceryListApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShoppingListController : ControllerBase
    {
        private readonly IShoppingListRepository _shoppingListRepository;
        private readonly ILogger<ShoppingListController> _logger;
        
        public ShoppingListController(
            IShoppingListRepository shoppingListRepository,
            ILogger<ShoppingListController> logger)
        {
            _shoppingListRepository = shoppingListRepository;
            _logger = logger;
        }
        
        [HttpGet]
        public async Task<ActionResult<ShoppingListDto>> GetShoppingList()
        {
            // For a real application, you would get the user ID from authentication
            const string userId = "test-user";
            
            _logger.LogInformation($"Getting shopping list for user: {userId}");
            
            // Get the latest shopping list for the user
            var latestShoppingList = await _shoppingListRepository.GetLatestShoppingListByUserIdAsync(userId);
            
            if (latestShoppingList == null)
            {
                return Ok(new ShoppingListDto { Items = new List<ShoppingListItemGroupDto>() });
            }
            
            // Get all shopping list items with product and category information
            var items = await _shoppingListRepository.GetShoppingListItemsAsync(latestShoppingList.Id);
            
            // Group by category
            var groupedItems = items
                .GroupBy(item => new { item.Product.CategoryId, CategoryName = item.Product.Category.Name })
                .Select(group => new ShoppingListItemGroupDto
                {
                    CategoryId = group.Key.CategoryId,
                    CategoryName = group.Key.CategoryName,
                    Products = group.Select(item => new ShoppingListItemDto
                    {
                        Id = item.ProductId,
                        Name = item.Product.Name,
                        Quantity = item.Quantity
                    }).ToList()
                })
                .ToList();
                
            return Ok(new ShoppingListDto
            {
                Id = latestShoppingList.Id,
                Items = groupedItems
            });
        }
        
        [HttpPost]
        public async Task<ActionResult<ShoppingListDto>> AddToShoppingList(AddToShoppingListDto model)
        {
            // For a real application, you would get the user ID from authentication
            const string userId = "test-user";
            
            _logger.LogInformation($"Adding to shopping list for user: {userId}, category: {model.CategoryId}");
            
            // Get the latest shopping list for the user or create a new one
            var latestShoppingList = await _shoppingListRepository.GetLatestShoppingListByUserIdAsync(userId);
            
            if (latestShoppingList == null)
            {
                latestShoppingList = new ShoppingList
                {
                    UserId = userId,
                    CreatedAt = DateTime.UtcNow
                };
                
                await _shoppingListRepository.AddAsync(latestShoppingList);
                await _shoppingListRepository.SaveChangesAsync();
            }
            
            // Update the shopping list items
            foreach (var productDto in model.Products.Where(p => p.Quantity > 0))
            {
                var existingItem = await _shoppingListRepository.GetShoppingListItemAsync(
                    latestShoppingList.Id, productDto.Id);
                        
                if (existingItem != null)
                {
                    // Update existing item
                    existingItem.Quantity = productDto.Quantity;
                    await _shoppingListRepository.UpdateShoppingListItemAsync(existingItem);
                }
                else
                {
                    // Add new item
                    var newItem = new ShoppingListItem
                    {
                        ShoppingListId = latestShoppingList.Id,
                        ProductId = productDto.Id,
                        Quantity = productDto.Quantity
                    };
                    await _shoppingListRepository.AddShoppingListItemAsync(newItem);
                }
            }
            
            // Also remove items with quantity set to 0
            foreach (var productDto in model.Products.Where(p => p.Quantity == 0))
            {
                var itemToRemove = await _shoppingListRepository.GetShoppingListItemAsync(
                    latestShoppingList.Id, productDto.Id);
                    
                if (itemToRemove != null)
                {
                    await _shoppingListRepository.RemoveShoppingListItemAsync(itemToRemove);
                }
            }
            
            // Update the timestamp
            latestShoppingList.UpdatedAt = DateTime.UtcNow;
            await _shoppingListRepository.UpdateAsync(latestShoppingList);
            
            await _shoppingListRepository.SaveChangesAsync();
            
            // Return the updated shopping list
            return await GetShoppingList();
        }
    }
}