// Pro.Admin/Services/Implementations/OrderService.cs
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.DTOs;
using Pro.Admin.Hubs;
using Pro.Admin.Models;
using Pro.Admin.Services.Interfaces;

namespace Pro.Admin.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repository;
        private readonly IMapper _mapper;
        private readonly IHubContext<DashboardHub> _hubContext;

        public OrderService(
            IOrderRepository repository,
            IMapper mapper,
            IHubContext<DashboardHub> hubContext)
        {
            _repository = repository;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        public Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<OrderDto>> GetFilteredOrdersAsync(OrderFilterDto filter)
        {
            var orders = await _repository.GetFilteredOrdersAsync(
                filter.OrderNumber,
                filter.FromDate,
                filter.ToDate,
                filter.Status);

            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public Task<OrderDto> GetOrderByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<OrderDto> GetOrderByNumberAsync(string orderNumber)
        {
            throw new NotImplementedException();
        }

        public async Task<OrderStatsDto> GetOrderStatisticsAsync()
        {
            var stats = await _repository.GetOrderStatisticsAsync();
            return _mapper.Map<OrderStatsDto>(stats);
        }

        public async Task UpdateOrderStatusAsync(int id, OrderStatus status)
        {
            await _repository.UpdateStatusAsync(id, status);

            // Notify clients of updated stats
            await _hubContext.Clients.All.SendAsync("OrderStatsUpdated", await GetOrderStatisticsAsync());
        }

        Task<OrderDto> IOrderService.GetOrderStatisticsAsync()
        {
            throw new NotImplementedException();
        }
    }
}