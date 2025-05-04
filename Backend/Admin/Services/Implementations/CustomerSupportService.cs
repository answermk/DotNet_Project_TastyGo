using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Pro.Admin.Data.Repositories.Interfaces;
using Pro.Admin.DTOs;
using Pro.Admin.Hubs;
using Pro.Admin.Models;
using Pro.Admin.Services.Interfaces;

namespace Pro.Admin.Services.Implementations
{
    public class CustomerSupportService : ICustomerSupportService
    {
        private readonly ICustomerSupportRepository _supportRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<DashboardHub> _hubContext;

        public CustomerSupportService(
            ICustomerSupportRepository supportRepository,
            IMapper mapper,
            IHubContext<DashboardHub> hubContext)
        {
            _supportRepository = supportRepository;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<CustomerSupportDto>> GetAllSupportsAsync()
        {
            var supports = await _supportRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<CustomerSupportDto>>(supports);
        }

        public async Task<IEnumerable<CustomerSupportDto>> GetPendingSupportsAsync()
        {
            var supports = await _supportRepository.GetPendingSupportsAsync();
            var dtos = _mapper.Map<IEnumerable<CustomerSupportDto>>(supports);

            foreach (var dto in dtos)
            {
                dto.TimeAgo = GetTimeAgo(dto.CreatedAt);
                dto.OrderNumber = $"ORD-{dto.Id}"; // Format order number as shown in UI
            }

            return dtos.OrderBy(dto => dto.CreatedAt);
        }

        public async Task<CustomerSupportDto> GetSupportByIdAsync(int id)
        {
            var support = await _supportRepository.GetByIdAsync(id);
            return _mapper.Map<CustomerSupportDto>(support);
        }

        public async Task<SupportStatsDto> GetSupportStatisticsAsync()
        {
            var stats = await _supportRepository.GetSupportStatisticsAsync();
            var dto = _mapper.Map<SupportStatsDto>(stats);

            await _hubContext.Clients.Group("CustomerSupportUpdates").SendAsync("StatsUpdated", dto);
            return dto;
        }

        public async Task RespondToCustomerAsync(int id, string response)
        {
            await _supportRepository.RespondToCustomerAsync(id, response);
            await GetSupportStatisticsAsync();
        }

        public async Task DeleteSupportAsync(int id)
        {
            await _supportRepository.DeleteSupportAsync(id);
            await GetSupportStatisticsAsync();
        }

        private string GetTimeAgo(DateTime dateTime)
        {
            TimeSpan timeSince = DateTime.UtcNow - dateTime;

            if (timeSince.TotalMinutes < 1)
                return "just now";
            if (timeSince.TotalMinutes < 2)
                return "1m ago";
            if (timeSince.TotalMinutes < 60)
                return $"{(int)timeSince.TotalMinutes}m ago";
            if (timeSince.TotalHours < 2)
                return "1h ago";
            if (timeSince.TotalHours < 24)
                return $"{(int)timeSince.TotalHours}h ago";
            if (timeSince.TotalDays < 2)
                return "1d ago";

            return $"{(int)timeSince.TotalDays}d ago";
        }
    }
}