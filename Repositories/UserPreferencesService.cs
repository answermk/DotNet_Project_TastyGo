using OurTastyGo.Models;
using System;

namespace OurTastyGo.Repositories
{
    public class UserPreferencesService : IUserPreferencesService
    {
        private readonly ApplicationDbContext _context;

        public UserPreferencesService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserPreferences> GetPreferencesAsync(string userId)
        {
            var preferences = await _context.UserPreferences.FindAsync(userId);

            if (preferences == null)
            {
                // Initialize default preferences if none exist
                return await InitializePreferencesAsync(userId);
            }

            return preferences;
        }

        public async Task UpdateThemePreferenceAsync(string userId, ThemePreference theme)
        {
            var preferences = await GetPreferencesForUpdateAsync(userId);
            preferences.Theme = theme;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateLanguagePreferenceAsync(string userId, LanguagePreference language)
        {
            var preferences = await GetPreferencesForUpdateAsync(userId);
            preferences.Language = language;
            await _context.SaveChangesAsync();
        }

        public async Task UpdateNotificationPreferencesAsync(string userId, NotificationPreferences notifications)
        {
            var preferences = await GetPreferencesForUpdateAsync(userId);
            preferences.Notifications = notifications;
            await _context.SaveChangesAsync();
        }

        public async Task<UserPreferences> InitializePreferencesAsync(string userId)
        {
            var defaultPreferences = new UserPreferences
            {
                UserId = userId,
                Theme = ThemePreference.Light, // Default theme
                Language = LanguagePreference.English, // Default language
                Notifications = new NotificationPreferences
                {
                    EmailNotifications = true,
                    PushNotifications = true,
                    SmsNotifications = false,
                    NotificationFrequency = "Daily"
                }
            };

            _context.UserPreferences.Add(defaultPreferences);
            await _context.SaveChangesAsync();
            return defaultPreferences;
        }

        private async Task<UserPreferences> GetPreferencesForUpdateAsync(string userId)
        {
            var preferences = await _context.UserPreferences.FindAsync(userId);

            if (preferences == null)
            {
                preferences = await InitializePreferencesAsync(userId);
            }

            return preferences;
        }

        Task IUserPreferencesService.InitializePreferencesAsync(string userId)
        {
            return InitializePreferencesAsync(userId);
        }
    }
}
