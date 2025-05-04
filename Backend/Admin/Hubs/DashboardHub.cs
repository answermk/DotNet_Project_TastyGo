// Pro.Admin/Hubs/DashboardHub.cs
using Microsoft.AspNetCore.SignalR;

namespace Pro.Admin.Hubs
{
    public class DashboardHub : Hub
    {
        public async Task JoinSupportGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "CustomerSupportUpdates");
        }
        public async Task JoinNotificationGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "NotificationUpdates");
        }
        public async Task JoinOrderGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "OrderUpdates");
        }
        public async Task JoinRestaurantGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "RestaurantUpdates");
        }

        public async Task JoinMenuGroup(int restaurantId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"MenuUpdates-{restaurantId}");
        }
    }
}