using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GroceryListApi.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}