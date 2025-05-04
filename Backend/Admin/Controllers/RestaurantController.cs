// Pro.Admin/Controllers/RestaurantsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pro.Admin.DTOs;
using Pro.Admin.Services.Interfaces;

namespace Pro.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantService _service;

        public RestaurantController(IRestaurantService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RestaurantDto>>> GetAll()
        {
            return Ok(await _service.GetAllRestaurantsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RestaurantDto>> GetById(int id)
        {
            return Ok(await _service.GetRestaurantByIdAsync(id));
        }

        [HttpPost]
        public async Task<ActionResult<RestaurantDto>> Create([FromBody] CreateRestaurantDto dto)
        {
            var restaurant = await _service.CreateRestaurantAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = restaurant.Id }, restaurant);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] RestaurantDto dto)
        {
            if (id != dto.Id) return BadRequest();
            await _service.UpdateRestaurantAsync(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteRestaurantAsync(id);
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<RestaurantDto>>> Search(
            [FromQuery] string searchTerm, [FromQuery] string category)
        {
            return Ok(await _service.SearchRestaurantsAsync(searchTerm, category));
        }

        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            await _service.ToggleRestaurantStatusAsync(id);
            return NoContent();
        }

        [HttpPost("{restaurantId}/menus")]
        public async Task<ActionResult<MenuDto>> AddMenu(int restaurantId, [FromBody] MenuDto dto)
        {
            dto.RestaurantId = restaurantId;
            var menu = await _service.AddMenuToRestaurantAsync(dto);
            return CreatedAtAction(nameof(GetMenu), new { restaurantId, menuId = menu.Id }, menu);
        }

        [HttpGet("{restaurantId}/menus/{menuId}")]
        public async Task<ActionResult<MenuDto>> GetMenu(int restaurantId, int menuId)
        {
            var menus = await _service.GetRestaurantMenusAsync(restaurantId);
            var menu = menus.FirstOrDefault(m => m.Id == menuId);
            if (menu == null) return NotFound();
            return Ok(menu);
        }

        [HttpDelete("{restaurantId}/menus/{menuId}")]
        public async Task<IActionResult> RemoveMenu(int restaurantId, int menuId)
        {
            await _service.RemoveMenuFromRestaurantAsync(menuId);
            return NoContent();
        }
    }
}