// Pro.Admin/Services/Implementations/NotificationService.cs
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.DTOs;
using Pro.Admin.Hubs;
using Pro.Admin.Models;
using Pro.Admin.Services.Interfaces;

namespace Pro.Admin.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _repository;
        private readonly IMapper _mapper;
        private readonly IHubContext<DashboardHub> _hubContext;

        public NotificationService(
            INotificationRepository repository,
            IMapper mapper,
            IHubContext<DashboardHub> hubContext)
        {
            _repository = repository;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<NotificationDto>> GetRecentNotificationsAsync(int count = 2)
        {
            var notifications = await _repository.GetRecentNotificationsAsync(count);
            return _mapper.Map<IEnumerable<NotificationDto>>(notifications);
        }

        public async Task<NotificationStatsDto> GetNotificationStatisticsAsync()
        {
            var stats = await _repository.GetNotificationStatisticsAsync();
            return _mapper.Map<NotificationStatsDto>(stats);
        }

        public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto dto)
        {
            var notification = _mapper.Map<Notification>(dto);
            notification = await _repository.AddAsync(notification);

            // Format recipient info for display
            var recipientInfo = dto.RecipientType == "ALL"
                ? "ALL users"
                : dto.RecipientName ?? "Specific user";

            var notificationDto = _mapper.Map<NotificationDto>(notification);
            notificationDto.RecipientInfo = recipientInfo;

            // Notify clients
            await _hubContext.Clients.All.SendAsync("NewNotification", notificationDto);
            await _hubContext.Clients.All.SendAsync("UpdateStats", await GetNotificationStatisticsAsync());

            return notificationDto;
        }

        public async Task RecordNotificationOpenAsync(int id)
        {
            await _repository.IncrementOpenCountAsync(id);
            await _hubContext.Clients.All.SendAsync("UpdateStats", await GetNotificationStatisticsAsync());
        }

        public Task<IEnumerable<NotificationDto>> GetAllNotificationsAsync()
        {
            throw new NotImplementedException();
        }

        Task<NotificationDto> INotificationService.GetNotificationStatisticsAsync()
        {
            throw new NotImplementedException();
        }
    }
}