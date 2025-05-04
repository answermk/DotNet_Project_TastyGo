using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order> GetByIdAsync(int id);
        Task<Order> GetByOrderNumberAsync(string orderNumber);
        Task<IEnumerable<Order>> GetFilteredOrdersAsync(string orderNumber, DateTime? fromDate, DateTime? toDate, OrderStatus? status);
        Task<Order> AddAsync(Order order);
        Task UpdateAsync(Order order);
        Task UpdateStatusAsync(int id, OrderStatus status);
        Task<OrderStats> GetOrderStatisticsAsync();
    }
}
