namespace Pro.Admin.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } // e.g., ORD-324
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public int RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }

    public enum OrderStatus
    {
        New,
        InProgress,
        Delivered,
        Canceled
    }
    public class OrderStats
    {
        public int TotalOrders { get; set; }
        public int NewOrders { get; set; }
        public int InProgressOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public int CanceledOrders { get; set; }
    }
}
