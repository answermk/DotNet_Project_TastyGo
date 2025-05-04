using Pro.Admin.DTOs;

namespace Pro.Admin.Services.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetAllNotificationsAsync();
        Task<IEnumerable<NotificationDto>> GetRecentNotificationsAsync(int count = 5);
        Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto dto);
        Task<NotificationDto> GetNotificationStatisticsAsync();
        Task RecordNotificationOpenAsync(int id);
    }
}
