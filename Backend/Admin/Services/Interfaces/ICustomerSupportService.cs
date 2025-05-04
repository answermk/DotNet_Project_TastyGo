using Pro.Admin.DTOs;

namespace Pro.Admin.Services.Interfaces
{
    public interface ICustomerSupportService
    {
        Task<IEnumerable<CustomerSupportDto>> GetAllSupportsAsync();
        Task<IEnumerable<CustomerSupportDto>> GetPendingSupportsAsync();
        Task<CustomerSupportDto> GetSupportByIdAsync(int id);
        Task<SupportStatsDto> GetSupportStatisticsAsync();
        Task RespondToCustomerAsync(int id, string response);
        Task DeleteSupportAsync(int id);
    }
}