using System.Collections.Generic;

namespace GroceryListApi.DTOs
{
    public class AddToShoppingListDto
    {
        public int CategoryId { get; set; }
        public List<ProductQuantityDto> Products { get; set; } = new List<ProductQuantityDto>();
    }
    
    public class ProductQuantityDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
    }
}