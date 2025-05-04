using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetAllAsync();
        Task<Notification> GetByIdAsync(int id);
        Task<IEnumerable<Notification>> GetRecentNotificationsAsync(int count = 5);
        Task<Notification> AddAsync(Notification notification);
        Task UpdateAsync(Notification notification);
        Task IncrementOpenCountAsync(int id);
        Task<NotificationStats> GetNotificationStatisticsAsync();
    }
}
