// Pro.Admin/Data/Repositories/Implementations/OrderRepository.cs
using Microsoft.EntityFrameworkCore;
using Pro.Admin.Data;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public Task<Order> AddAsync(Order order)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .ToListAsync();
        }

        public async Task<Order> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public Task<Order> GetByOrderNumberAsync(string orderNumber)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Order>> GetFilteredOrdersAsync(
            string? orderNumber = null,
            DateTime? fromDate = null,
            DateTime? toDate = null,
            OrderStatus? status = null)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Restaurant)
                .AsQueryable();

            if (!string.IsNullOrEmpty(orderNumber))
                query = query.Where(o => o.OrderNumber.Contains(orderNumber));

            if (fromDate.HasValue)
                query = query.Where(o => o.OrderDate >= fromDate);

            if (toDate.HasValue)
                query = query.Where(o => o.OrderDate <= toDate);

            if (status.HasValue)
                query = query.Where(o => o.Status == status);

            return await query.ToListAsync();
        }

        public async Task<OrderStats> GetOrderStatisticsAsync()
        {
            return new OrderStats
            {
                NewOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.New),
                DeliveredOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Delivered),
                CanceledOrders = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Canceled)
            };
        }

        public Task UpdateAsync(Order order)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateStatusAsync(int id, OrderStatus status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                order.Status = status;
                if (status == OrderStatus.Delivered)
                    order.DeliveryDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }
        }
    }
}