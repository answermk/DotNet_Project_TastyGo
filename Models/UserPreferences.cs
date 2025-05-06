namespace OurTastyGo.Models
{
    public class UserPreferences
    {
        public string? UserId { get; set; }
        public NotificationPreferences? Theme { get; set; }
        public LanguagePreference Language { get; set; }
        public NotificationPreferences? Notifications { get; set; }
    }
}
