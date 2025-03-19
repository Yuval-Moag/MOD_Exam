using GroceryListApi.Data;
using GroceryListApi.Models;
using GroceryListApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GroceryListApi.Repositories.Implementations
{
    public class ShoppingListRepository : Repository<ShoppingList>, IShoppingListRepository
    {
        public ShoppingListRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<ShoppingList> GetLatestShoppingListByUserIdAsync(string userId)
        {
            return await _context.ShoppingLists
                .Where(sl => sl.UserId == userId)
                .OrderByDescending(sl => sl.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ShoppingListItem>> GetShoppingListItemsAsync(int shoppingListId)
        {
            return await _context.ShoppingListItems
                .Where(item => item.ShoppingListId == shoppingListId)
                .Include(item => item.Product)
                .ThenInclude(product => product.Category)
                .ToListAsync();
        }

        public async Task<ShoppingListItem> GetShoppingListItemAsync(int shoppingListId, int productId)
        {
            return await _context.ShoppingListItems
                .FirstOrDefaultAsync(item => 
                    item.ShoppingListId == shoppingListId && 
                    item.ProductId == productId);
        }

        public async Task AddShoppingListItemAsync(ShoppingListItem item)
        {
            await _context.ShoppingListItems.AddAsync(item);
        }

        public Task UpdateShoppingListItemAsync(ShoppingListItem item)
        {
            _context.ShoppingListItems.Attach(item);
            _context.Entry(item).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        public Task RemoveShoppingListItemAsync(ShoppingListItem item)
        {
            _context.ShoppingListItems.Remove(item);
            return Task.CompletedTask;
        }
    }
}
