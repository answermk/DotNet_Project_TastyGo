// Pro.Admin/Data/Repositories/Implementations/MenuRepository.cs
using Microsoft.EntityFrameworkCore;
using Pro.Admin.Data;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Implementations
{
    public class MenuRepository : IMenuRepository
    {
        private readonly ApplicationDbContext _context;

        public MenuRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Menu> AddAsync(Menu menu)
        {
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();
            return menu;
        }

        public async Task DeleteAsync(int id)
        {
            var menu = await _context.Menus.FindAsync(id);
            if (menu != null)
            {
                _context.Menus.Remove(menu);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Menu>> GetByRestaurantAsync(int restaurantId)
        {
            return await _context.Menus
                .Where(m => m.RestaurantId == restaurantId)
                .ToListAsync();
        }

        public async Task<Menu> UpdateAsync(Menu menu)
        {
            _context.Menus.Update(menu);
            await _context.SaveChangesAsync();
            return menu;
        }

        public async Task<Menu> GetByIdAsync(int id)
        {
            return await _context.Menus.FindAsync(id);
        }
    }
}