using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Interfaces
{
    public interface ICustomerSupportRepository
    {
        Task<IEnumerable<CustomerSupport>> GetAllAsync();
        Task<CustomerSupport> GetByIdAsync(int id);
        Task<IEnumerable<CustomerSupport>> GetPendingSupportsAsync();
        Task<CustomerSupport> AddAsync(CustomerSupport support);
        Task UpdateAsync(CustomerSupport support);
        Task RespondToCustomerAsync(int id, string response);
        Task DeleteSupportAsync(int id);
        Task<SupportStats> GetSupportStatisticsAsync();
    }

    public class SupportStats
    {
        public int PendingCount { get; set; }
        public int RespondedCount { get; set; }
        public int DeletedCount { get; set; }
    }
}