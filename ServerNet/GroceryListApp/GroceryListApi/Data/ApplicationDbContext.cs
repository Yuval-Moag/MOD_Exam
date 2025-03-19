using GroceryListApi.Models;
using Microsoft.EntityFrameworkCore;

namespace GroceryListApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<ShoppingList> ShoppingLists { get; set; } = null!;
        public DbSet<ShoppingListItem> ShoppingListItems { get; set; } = null!;
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Seed data for categories
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "חלב וגבינות" },
                new Category { Id = 2, Name = "טואלטיקה" },
                new Category { Id = 3, Name = "בשר" },
                new Category { Id = 4, Name = "ירקות ופירות" }
            );
            
            // Seed data for products
            modelBuilder.Entity<Product>().HasData(
                // חלב וגבינות
                new Product { Id = 1, Name = "קוטג'", CategoryId = 1 },
                new Product { Id = 2, Name = "חלב 3%", CategoryId = 1 },
                new Product { Id = 3, Name = "שמנת חמוצה", CategoryId = 1 },
                
                // טואלטיקה
                new Product { Id = 4, Name = "סבון", CategoryId = 2 },
                new Product { Id = 5, Name = "שמפו", CategoryId = 2 },
                
                // בשר
                new Product { Id = 6, Name = "נקניקיות", CategoryId = 3 },
                new Product { Id = 7, Name = "שוקיים", CategoryId = 3 },
                new Product { Id = 8, Name = "סלמון", CategoryId = 3 },
                
                // ירקות ופירות
                new Product { Id = 9, Name = "תפוח", CategoryId = 4 },
                new Product { Id = 10, Name = "בננה", CategoryId = 4 },
                new Product { Id = 11, Name = "עגבניה", CategoryId = 4 },
                new Product { Id = 12, Name = "מלפפון", CategoryId = 4 }
            );
        }
    }
}