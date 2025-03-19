using GroceryListApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GroceryListApi.Repositories.Interfaces
{
    public interface IShoppingListRepository : IRepository<ShoppingList>
    {
        Task<ShoppingList> GetLatestShoppingListByUserIdAsync(string userId);
        Task<IEnumerable<ShoppingListItem>> GetShoppingListItemsAsync(int shoppingListId);
        Task<ShoppingListItem> GetShoppingListItemAsync(int shoppingListId, int productId);
        Task AddShoppingListItemAsync(ShoppingListItem item);
        Task UpdateShoppingListItemAsync(ShoppingListItem item);
        Task RemoveShoppingListItemAsync(ShoppingListItem item);
    }
}
