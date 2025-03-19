using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GroceryListApi.DTOs;
using GroceryListApi.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GroceryListApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;
        private readonly IShoppingListRepository _shoppingListRepository;
        private readonly ILogger<ProductsController> _logger;
        
        public ProductsController(
            IProductRepository productRepository,
            IShoppingListRepository shoppingListRepository,
            ILogger<ProductsController> logger)
        {
            _productRepository = productRepository;
            _shoppingListRepository = shoppingListRepository;
            _logger = logger;
        }
        
        [HttpGet("category/{categoryId}")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(int categoryId)
        {
            _logger.LogInformation($"Getting products for category ID: {categoryId}");
            
            // For a real application, you would use the user's ID to get their quantities
            // For simplicity, we're using a hardcoded user ID
            const string userId = "test-user";
            
            // Get the latest shopping list for the user
            var latestShoppingList = await _shoppingListRepository.GetLatestShoppingListByUserIdAsync(userId);
            
            // Get all products for the category
            var products = await _productRepository.GetProductsByCategoryAsync(categoryId);
            
            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                Quantity = 0 // Default quantity is 0
            }).ToList();
            
            // If the user has a shopping list, update the quantities
            if (latestShoppingList != null)
            {
                var shoppingListItems = await _shoppingListRepository.GetShoppingListItemsAsync(latestShoppingList.Id);
                var itemsForCategory = shoppingListItems.Where(item => products.Any(p => p.Id == item.ProductId));
                
                foreach (var product in productDtos)
                {
                    var shoppingListItem = itemsForCategory.FirstOrDefault(item => item.ProductId == product.Id);
                    if (shoppingListItem != null)
                    {
                        product.Quantity = shoppingListItem.Quantity;
                    }
                }
            }
            
            return Ok(productDtos);
        }
    }
}