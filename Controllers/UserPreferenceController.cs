using Microsoft.AspNetCore.Mvc;
using OurTastyGo.Models;
using OurTastyGo.Repositories;

namespace OurTastyGo.Controllers
{
    public class UserPreferenceController
    {
        [ApiController]
        [Route("api/[controller]")]
        public class PreferencesController : ControllerBase
        {
            private readonly IUserPreferencesService _preferencesService;

            public PreferencesController(IUserPreferencesService preferencesService)
            {
                _preferencesService = preferencesService;
            }

            [HttpGet("{userId}")]
            public async Task<ActionResult<UserPreferences>> GetPreferences(string userId)
            {
                var preferences = await _preferencesService.GetPreferencesAsync(userId);
                return Ok(preferences);
            }

            [HttpPut("{userId}/theme")]
            public async Task<IActionResult> UpdateTheme(string userId, [FromBody] ThemePreference theme)
            {
                await _preferencesService.UpdateThemePreferenceAsync(userId, theme);
                return NoContent();
            }

            [HttpPut("{userId}/language")]
            public async Task<IActionResult> UpdateLanguage(string userId, [FromBody] LanguagePreference language)
            {
                await _preferencesService.UpdateLanguagePreferenceAsync(userId, language);
                return NoContent();
            }

            [HttpPut("{userId}/notifications")]
            public async Task<IActionResult> UpdateNotifications(string userId, [FromBody] NotificationPreferences notifications)
            {
                await _preferencesService.UpdateNotificationPreferencesAsync(userId, notifications);
                return NoContent();
            }
        }
    }
}
