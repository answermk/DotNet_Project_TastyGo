// Pro.Admin/Services/Interfaces/IRestaurantService.cs
using Pro.Admin.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Pro.Admin.Services.Interfaces
{
    public interface IRestaurantService
    {
        Task<IEnumerable<RestaurantDto>> GetAllRestaurantsAsync();
        Task<RestaurantDto> GetRestaurantByIdAsync(int id);
        Task<RestaurantDto> CreateRestaurantAsync(CreateRestaurantDto dto);
        Task UpdateRestaurantAsync(int id, RestaurantDto dto);
        Task DeleteRestaurantAsync(int id);
        Task<IEnumerable<RestaurantDto>> SearchRestaurantsAsync(string searchTerm, string category);
        Task ToggleRestaurantStatusAsync(int id);

        // Menu-related methods
        Task<MenuDto> AddMenuToRestaurantAsync(MenuDto dto);
        Task RemoveMenuFromRestaurantAsync(int menuId);
        Task<IEnumerable<MenuDto>> GetRestaurantMenusAsync(int restaurantId);
    }
}