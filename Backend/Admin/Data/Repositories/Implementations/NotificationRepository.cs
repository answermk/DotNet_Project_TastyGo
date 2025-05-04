// Pro.Admin/Data/Repositories/Implementations/NotificationRepository.cs
using Microsoft.EntityFrameworkCore;
using Pro.Admin.Data;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.Models;

namespace Pro.Admin.Data.Repositories.Implementations
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;

        public NotificationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetAllAsync()
        {
            return await _context.Notifications.ToListAsync();
        }

        public async Task<Notification> GetByIdAsync(int id)
        {
            return await _context.Notifications.FindAsync(id);
        }

        public async Task<IEnumerable<Notification>> GetRecentNotificationsAsync(int count = 2)
        {
            return await _context.Notifications
                .OrderByDescending(n => n.SentDate)
                .Take(count)
                .ToListAsync();
        }

        public async Task<Notification> AddAsync(Notification notification)
        {
            notification.SentDate = DateTime.UtcNow;
            notification.TotalSent = notification.RecipientType == "ALL" ?
                await _context.Customers.CountAsync() : 1;

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task<NotificationStats> GetNotificationStatisticsAsync()
        {
            var totalSent = await _context.Notifications.SumAsync(n => n.TotalSent);
            var totalOpened = await _context.Notifications.SumAsync(n => n.OpenCount);
            var newNotifications = await _context.Notifications
                .CountAsync(n => n.SentDate.Date == DateTime.UtcNow.Date);

            return new NotificationStats
            {
                TotalNotifications = await _context.Notifications.CountAsync(),
                NewNotifications = newNotifications,
                TotalSent = totalSent,
                TotalOpened = totalOpened,
                OpenRate = totalSent > 0 ? (double)totalOpened / totalSent * 100 : 0
            };
        }

        public async Task IncrementOpenCountAsync(int id)
        {
            var notification = await _context.Notifications.FindAsync(id);
            if (notification != null)
            {
                notification.OpenCount++;
                await _context.SaveChangesAsync();
            }
        }

        public Task UpdateAsync(Notification notification)
        {
            throw new NotImplementedException();
        }
    }
}