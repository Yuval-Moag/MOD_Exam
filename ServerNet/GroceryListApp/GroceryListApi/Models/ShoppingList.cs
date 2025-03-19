using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GroceryListApi.Models
{
    public class ShoppingList
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string UserId { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public ICollection<ShoppingListItem> Items { get; set; } = new List<ShoppingListItem>();
    }
}