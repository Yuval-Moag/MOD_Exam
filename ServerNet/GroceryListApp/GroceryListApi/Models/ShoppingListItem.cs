using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GroceryListApi.Models
{
    public class ShoppingListItem
    {
        [Key]
        public int Id { get; set; }
        
        [ForeignKey("ShoppingList")]
        public int ShoppingListId { get; set; }
        
        [ForeignKey("Product")]
        public int ProductId { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        public ShoppingList ShoppingList { get; set; } = null!;
        public Product Product { get; set; } = null!;
    }
}