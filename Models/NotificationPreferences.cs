
namespace OurTastyGo.Models
{
    public class NotificationPreferences
    {
        public bool EmailNotifications { get; set; }
        public bool PushNotifications { get; set; }
        public bool SmsNotifications { get; set; }
        public string? NotificationFrequency { get; set; }

        public static implicit operator NotificationPreferences(ThemePreference v)
        {
            throw new NotImplementedException();
        }
    }
}
