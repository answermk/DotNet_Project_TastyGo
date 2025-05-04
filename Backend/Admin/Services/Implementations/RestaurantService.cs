// Pro.Admin/Services/Implementations/RestaurantService.cs
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.DTOs;
using Pro.Admin.Hubs;
using Pro.Admin.Models;
using Pro.Admin.Services.Interfaces;

namespace Pro.Admin.Services.Implementations
{
    public class RestaurantService : IRestaurantService
    {
        private readonly IRestaurantRepository _restaurantRepo;
        private readonly IMenuRepository _menuRepo;
        private readonly IMapper _mapper;
        private readonly IHubContext<DashboardHub> _hubContext;

        public RestaurantService(
            IRestaurantRepository restaurantRepo,
            IMenuRepository menuRepo,
            IMapper mapper,
            IHubContext<DashboardHub> hubContext)
        {
            _restaurantRepo = restaurantRepo;
            _menuRepo = menuRepo;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<RestaurantDto>> GetAllRestaurantsAsync()
        {
            var restaurants = await _restaurantRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<RestaurantDto>>(restaurants);
        }

        public async Task<RestaurantDto> GetRestaurantByIdAsync(int id)
        {
            var restaurant = await _restaurantRepo.GetByIdAsync(id);
            return _mapper.Map<RestaurantDto>(restaurant);
        }

        public async Task<RestaurantDto> CreateRestaurantAsync(CreateRestaurantDto dto)
        {
            var restaurant = _mapper.Map<Restaurant>(dto);
            restaurant = await _restaurantRepo.AddAsync(restaurant);
            return _mapper.Map<RestaurantDto>(restaurant);
        }

        public async Task UpdateRestaurantAsync(int id, RestaurantDto dto)
        {
            var restaurant = await _restaurantRepo.GetByIdAsync(id);
            _mapper.Map(dto, restaurant);
            await _restaurantRepo.UpdateAsync(restaurant);
        }

        public async Task DeleteRestaurantAsync(int id)
        {
            await _restaurantRepo.DeleteAsync(id);
        }

        public async Task<IEnumerable<RestaurantDto>> SearchRestaurantsAsync(string searchTerm, string category)
        {
            var restaurants = await _restaurantRepo.SearchAsync(searchTerm, category);
            return _mapper.Map<IEnumerable<RestaurantDto>>(restaurants);
        }

        public async Task ToggleRestaurantStatusAsync(int id)
        {
            await _restaurantRepo.ToggleActiveStatusAsync(id);
        }


        public async Task<MenuDto> AddMenuToRestaurantAsync(MenuDto dto)
        {
            var menu = _mapper.Map<Menu>(dto);
            menu = await _menuRepo.AddAsync(menu);

            // Notify clients
            await _hubContext.Clients.Group($"MenuUpdates-{dto.RestaurantId}")
                .SendAsync("MenuAdded", _mapper.Map<MenuDto>(menu));

            return _mapper.Map<MenuDto>(menu);
        }

        public async Task RemoveMenuFromRestaurantAsync(int menuId)
        {
            var menu = await _menuRepo.GetByIdAsync(menuId);
            if (menu != null)
            {
                await _menuRepo.DeleteAsync(menuId);

                // Notify clients
                await _hubContext.Clients.Group($"MenuUpdates-{menu.RestaurantId}")
                    .SendAsync("MenuRemoved", menuId);
            }
        }

        public async Task<IEnumerable<MenuDto>> GetRestaurantMenusAsync(int restaurantId)
        {
            var menus = await _menuRepo.GetByRestaurantAsync(restaurantId);
            return _mapper.Map<IEnumerable<MenuDto>>(menus);
        }
    }
}
