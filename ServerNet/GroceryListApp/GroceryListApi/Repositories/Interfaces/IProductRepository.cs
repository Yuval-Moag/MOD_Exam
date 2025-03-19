using GroceryListApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GroceryListApi.Repositories.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(int categoryId);
    }
}