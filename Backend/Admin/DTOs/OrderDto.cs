// Pro.Admin/DTOs/OrderDto.cs
using System.ComponentModel.DataAnnotations;
using Pro.Admin.Models;

namespace Pro.Admin.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = null!; // e.g., "ORD-324"
        public string CustomerName { get; set; } = null!;
        public string RestaurantName { get; set; } = null!;
        public OrderStatus Status { get; set; }
        public string StatusDisplay => Status.ToString();
        public DateTime OrderDate { get; set; }
        public string OrderDateDisplay => OrderDate.ToString("dd/MM/yyyy");
    }

    public class OrderStatsDto
    {
        public int NewOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public int CanceledOrders { get; set; }
    }

    public class OrderStatusUpdateDto
    {
        [Required]
        public OrderStatus Status { get; set; }
    }

    public class OrderFilterDto
    {
        public string? OrderNumber { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public OrderStatus? Status { get; set; }
    }
}