using Microsoft.EntityFrameworkCore;
using OurTastyGo.Models;
using System;

namespace OurTastyGo.Repositories
{
    public class RestaurantRepository : IRestaurantRepository
    {
        private readonly ApplicationDbContext _context;

        public RestaurantRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task AddRestaurantAsync(Restaurant restaurant)
        {
            throw new NotImplementedException();
        }

        public Task DeleteRestaurantAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Restaurant?> GetRestaurantByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Restaurant>> SearchRestaurantsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return Enumerable.Empty<Restaurant>();

            return await _context.Restaurants
                .Where(r =>
                    EF.Functions.Like(r.Name, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.Category, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.Description, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.StreetAddress, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.City, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.Country, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.POBox, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.PhoneNumber, $"%{searchTerm}%") ||
                    EF.Functions.Like(r.Email, $"%{searchTerm}%"))
                .ToListAsync();
        }

        public Task UpdateRestaurantAsync(Restaurant restaurant)
        {
            throw new NotImplementedException();
        }
    }
}