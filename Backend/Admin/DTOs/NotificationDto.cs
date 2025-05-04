// Pro.Admin/DTOs/NotificationDto.cs
using System.ComponentModel.DataAnnotations;

namespace Pro.Admin.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string SentDateFormatted => SentDate.ToString("dd/MM/yyyy");
        public DateTime SentDate { get; set; }
        public string RecipientInfo { get; set; } = null!;
        public double OpenRate { get; set; }
        public string OpenRateDisplay => $"{OpenRate:0}%";
    }

    public class CreateNotificationDto
    {
        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; } = null!;

        [Required(ErrorMessage = "Message is required")]
        public string Message { get; set; } = null!;

        public string RecipientType { get; set; } = "ALL";
        public string? RecipientName { get; set; }
    }

    public class NotificationStatsDto
    {
        public int NewNotifications { get; set; }
        public double OpenRate { get; set; }
        public string OpenRateDisplay => $"{OpenRate:0}%";
    }
}