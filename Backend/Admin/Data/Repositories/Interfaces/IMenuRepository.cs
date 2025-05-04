// Pro.Admin/Data/Repositories/Interfaces/IMenuRepository.cs
using Pro.Admin.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pro.Admin.Data.Repositories.Interfaces
{
    public interface IMenuRepository
    {
        Task<Menu> AddAsync(Menu menu);
        Task DeleteAsync(int id);
        Task<IEnumerable<Menu>> GetByRestaurantAsync(int restaurantId);
        Task<Menu> UpdateAsync(Menu menu);
        Task<Menu> GetByIdAsync(int id); // Added this missing method
    }
}