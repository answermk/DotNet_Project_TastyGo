// Pro.Admin/Controllers/OrdersController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pro.Admin.DTOs;
using Pro.Admin.Services.Interfaces;

namespace Pro.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrdersController(IOrderService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders([FromQuery] OrderFilterDto filter)
        {
            var orders = await _service.GetFilteredOrdersAsync(filter);
            return Ok(orders);
        }

        [HttpGet("stats")]
        public async Task<ActionResult<OrderStatsDto>> GetStats()
        {
            return Ok(await _service.GetOrderStatisticsAsync());
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatusUpdateDto dto)
        {
            await _service.UpdateOrderStatusAsync(id, dto.Status);
            return NoContent();
        }
    }
}