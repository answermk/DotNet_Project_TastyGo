// Pro.Admin/DTOs/RestaurantDto.cs
using System.ComponentModel.DataAnnotations;

namespace Pro.Admin.DTOs
{
    public class RestaurantDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string StreetAddress { get; set; } = null!;
        public string City { get; set; } = null!;
        public string Country { get; set; } = null!;
        public string? POBox { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsActive { get; set; }
        public double Rating { get; set; }
        public string EstimatedDeliveryTime { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string StatusDisplay => IsActive ? "Active" : "InActive";
    }

    public class CreateRestaurantDto
    {
        [Required(ErrorMessage = "Restaurant name is required")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; } = null!;

        public string Description { get; set; } = null!;

        [Required(ErrorMessage = "Street address is required")]
        public string StreetAddress { get; set; } = null!;

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; } = null!;

        [Required(ErrorMessage = "Country is required")]
        public string Country { get; set; } = null!;

        public string? POBox { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string PhoneNumber { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; } = null!;
    }

    public class MenuDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Item name is required")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Category is required")]
        public string Category { get; set; } = null!;

        [Required(ErrorMessage = "Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        public string Description { get; set; } = null!;
        public int RestaurantId { get; set; }
    }
}