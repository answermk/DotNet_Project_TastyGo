using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Interfaces
{
    public interface IRestaurantRepository
    {
        Task<IEnumerable<Restaurant>> GetAllAsync();
        Task<Restaurant> GetByIdAsync(int id);
        Task<Restaurant> AddAsync(Restaurant restaurant);
        Task UpdateAsync(Restaurant restaurant);
        Task DeleteAsync(int id);
        Task<IEnumerable<Restaurant>> SearchAsync(string searchTerm, string category);
        Task ToggleActiveStatusAsync(int id);
    }
}
