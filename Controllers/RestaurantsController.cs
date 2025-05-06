using Microsoft.AspNetCore.Mvc;
using OurTastyGo.DOTs;
using OurTastyGo.Repositories;

namespace OurTastyGo.Controllers
{
   
        [Route("api/[controller]")]
        [ApiController]
        public class RestaurantsController : ControllerBase
        {
            private readonly IRestaurantRepository _repository;

            public RestaurantsController(IRestaurantRepository repository)
            {
                _repository = repository;
            }

            // GET: api/restaurants/search?term=pizza
            [HttpGet("search")]
            public async Task<ActionResult<IEnumerable<RestaurantDto>>> SearchRestaurants([FromQuery] string term)
            {
                try
                {
                    var restaurants = await _repository.SearchRestaurantsAsync(term);

                    if (!restaurants.Any())
                        return NotFound("No restaurants found matching your search criteria");

                    var restaurantDtos = restaurants.Select(r => new RestaurantDto
                    {
                        Id = r.Id,
                        Name = r.Name,
                        Category = r.Category,
                        Description = r.Description,
                        StreetAddress = r.StreetAddress,
                        City = r.City,
                        Country = r.Country,
                        POBox = r.POBox,
                        PhoneNumber = r.PhoneNumber,
                        Email = r.Email
                    });

                    return Ok(restaurantDtos);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"An error occurred while searching restaurants: {ex.Message}");
                }
            }

            // Add other CRUD endpoints as needed...
        }
    }


