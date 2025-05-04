// Pro.Admin/Models/Notification.cs
namespace Pro.Admin.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public DateTime SentDate { get; set; }
        public string RecipientType { get; set; } = "ALL"; // "ALL" or "SPECIFIC"
        public string? RecipientName { get; set; }
        public int OpenCount { get; set; }
        public int TotalSent { get; set; }
    }

    public class NotificationStats
    {
        public int TotalNotifications { get; set; }
        public int NewNotifications { get; set; }
        public int TotalSent { get; set; }
        public int TotalOpened { get; set; }
        public double OpenRate { get; set; }
    }
}