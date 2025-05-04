using Pro.Admin.Models;
using Pro.Admin.Data;
using Microsoft.EntityFrameworkCore;
using Pro.Admin.Data.Repositories.Interfaces;

namespace Pro.Admin.Data.Repositories.Implementations
{
    public class CustomerSupportRepository : ICustomerSupportRepository
    {
        private readonly ApplicationDbContext _context;

        public CustomerSupportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CustomerSupport>> GetAllAsync()
        {
            return await _context.CustomerSupports
                .Include(cs => cs.Customer)
                .Include(cs => cs.Order)
                .ToListAsync();
        }

        public async Task<CustomerSupport> GetByIdAsync(int id)
        {
            return await _context.CustomerSupports
                .Include(cs => cs.Customer)
                .Include(cs => cs.Order)
                .FirstOrDefaultAsync(cs => cs.Id == id);
        }

        public async Task<IEnumerable<CustomerSupport>> GetPendingSupportsAsync()
        {
            return await _context.CustomerSupports
                .Include(cs => cs.Customer)
                .Include(cs => cs.Order)
                .Where(cs => cs.Status == SupportStatus.Pending && !cs.IsDeleted)
                .OrderBy(cs => cs.CreatedAt)
                .ToListAsync();
        }

        public async Task<CustomerSupport> AddAsync(CustomerSupport support)
        {
            support.CreatedAt = DateTime.UtcNow;
            support.Status = SupportStatus.Pending;
            _context.CustomerSupports.Add(support);
            await _context.SaveChangesAsync();
            return support;
        }

        public async Task UpdateAsync(CustomerSupport support)
        {
            _context.CustomerSupports.Update(support);
            await _context.SaveChangesAsync();
        }

        public async Task RespondToCustomerAsync(int id, string response)
        {
            var support = await _context.CustomerSupports.FindAsync(id);
            if (support != null)
            {
                support.Status = SupportStatus.Responded;
                support.Response = response;
                support.RespondedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteSupportAsync(int id)
        {
            var support = await _context.CustomerSupports.FindAsync(id);
            if (support != null)
            {
                support.IsDeleted = true;
                support.Status = SupportStatus.Deleted;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<SupportStats> GetSupportStatisticsAsync()
        {
            return new SupportStats
            {
                PendingCount = await _context.CustomerSupports.CountAsync(cs => cs.Status == SupportStatus.Pending && !cs.IsDeleted),
                RespondedCount = await _context.CustomerSupports.CountAsync(cs => cs.Status == SupportStatus.Responded && !cs.IsDeleted),
                DeletedCount = await _context.CustomerSupports.CountAsync(cs => cs.IsDeleted)
            };
        }
    }
}