using OurTastyGo.Models;

namespace OurTastyGo.Repositories
{
    public interface IRestaurantRepository
    {
        Task<IEnumerable<Restaurant>> SearchRestaurantsAsync(string searchTerm);
        Task<Restaurant?> GetRestaurantByIdAsync(int id);
        Task AddRestaurantAsync(Restaurant restaurant);
        Task UpdateRestaurantAsync(Restaurant restaurant);
        Task DeleteRestaurantAsync(int id);
    }
}
