// Pro.Admin/Data/Repositories/Implementations/RestaurantRepository.cs
using Microsoft.EntityFrameworkCore;
using Pro.Admin.Data;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Implementations
{
    public class RestaurantRepository : IRestaurantRepository
    {
        private readonly ApplicationDbContext _context;

        public RestaurantRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Restaurant>> GetAllAsync()
        {
            return await _context.Restaurants
                .Include(r => r.Menus)
                .ToListAsync();
        }

        public async Task<Restaurant> GetByIdAsync(int id)
        {
            return await _context.Restaurants
                .Include(r => r.Menus)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Restaurant> AddAsync(Restaurant restaurant)
        {
            restaurant.Location = $"{restaurant.City}, {restaurant.Country}";
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
            return restaurant;
        }

        public async Task UpdateAsync(Restaurant restaurant)
        {
            restaurant.Location = $"{restaurant.City}, {restaurant.Country}";
            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant != null)
            {
                _context.Restaurants.Remove(restaurant);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Restaurant>> SearchAsync(string searchTerm, string category)
        {
            var query = _context.Restaurants
                .Include(r => r.Menus)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(r =>
                    r.Name.Contains(searchTerm) ||
                    r.Description.Contains(searchTerm) ||
                    r.Category.Contains(searchTerm));
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(r => r.Category == category);
            }

            return await query.ToListAsync();
        }

        public async Task ToggleActiveStatusAsync(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant != null)
            {
                restaurant.IsActive = !restaurant.IsActive;
                await _context.SaveChangesAsync();
            }
        }
    }
}