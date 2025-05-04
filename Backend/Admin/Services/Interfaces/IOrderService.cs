using Pro.Admin.DTOs;
using Pro.Admin.Models;

namespace Pro.Admin.Services.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto> GetOrderByIdAsync(int id);
        Task<OrderDto> GetOrderByNumberAsync(string orderNumber);
        Task<IEnumerable<OrderDto>> GetFilteredOrdersAsync(OrderFilterDto filter);
        Task<OrderDto> GetOrderStatisticsAsync();
        Task UpdateOrderStatusAsync(int id, OrderStatus status);
    }
}
