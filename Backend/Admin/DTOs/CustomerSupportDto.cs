using System.ComponentModel.DataAnnotations;
using Pro.Admin.Models;

namespace Pro.Admin.DTOs
{
    public class CustomerSupportDto
    {
        public int Id { get; set; }
        public string? OrderNumber { get; set; }
        public string? CustomerName { get; set; }
        public string? Message { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? TimeAgo { get; set; }
        public SupportStatus Status { get; set; }
    }

    public class SupportStatsDto
    {
        public int PendingCount { get; set; }
        public int RespondedCount { get; set; }
        public int DeletedCount { get; set; }
    }

    public class CustomerSupportResponseDto
    {
        [Required]
        public string? Response { get; set; }
    }
}