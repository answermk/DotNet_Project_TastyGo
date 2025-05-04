// Pro.Admin/Controllers/NotificationsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pro.Admin.DTOs;
using Pro.Admin.Services.Interfaces;

namespace Pro.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationController(INotificationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetRecentNotifications()
        {
            return Ok(await _service.GetRecentNotificationsAsync());
        }

        [HttpGet("stats")]
        public async Task<ActionResult<NotificationStatsDto>> GetStats()
        {
            return Ok(await _service.GetNotificationStatisticsAsync());
        }

        [HttpPost]
        public async Task<ActionResult<NotificationDto>> CreateNotification([FromBody] CreateNotificationDto dto)
        {
            var notification = await _service.CreateNotificationAsync(dto);
            return CreatedAtAction(nameof(GetRecentNotifications), notification);
        }
    }
}