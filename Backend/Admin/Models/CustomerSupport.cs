namespace Pro.Admin.Models
{
    public class CustomerSupport
    {
        public int Id { get; set; }
        public int? OrderId { get; set; }
        public Order Order { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public SupportStatus Status { get; set; }
        public DateTime? RespondedAt { get; set; }
        public string Response { get; set; }
        public bool IsDeleted { get; set; }
    }

    public enum SupportStatus
    {
        Pending,
        Responded,
        Deleted
    }
}