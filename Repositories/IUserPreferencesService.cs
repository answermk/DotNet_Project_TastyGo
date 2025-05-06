using OurTastyGo.Models;

namespace OurTastyGo.Repositories
{
    public interface IUserPreferencesService
    {
        Task<UserPreferences> GetPreferencesAsync(string userId);
        Task UpdateThemePreferenceAsync(string userId, ThemePreference theme);
        Task UpdateLanguagePreferenceAsync(string userId, LanguagePreference language);
        Task UpdateNotificationPreferencesAsync(string userId, NotificationPreferences notifications);
        Task InitializePreferencesAsync(string userId);
    }
}
