using System.Collections.Generic;

namespace GroceryListApi.DTOs
{
    public class ShoppingListDto
    {
        public int Id { get; set; }
        public List<ShoppingListItemGroupDto> Items { get; set; } = new List<ShoppingListItemGroupDto>();
    }
    
    public class ShoppingListItemGroupDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public List<ShoppingListItemDto> Products { get; set; } = new List<ShoppingListItemDto>();
    }
    
    public class ShoppingListItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}