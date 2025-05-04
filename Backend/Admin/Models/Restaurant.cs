using System.ComponentModel.DataAnnotations;

namespace Pro.Admin.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Category { get; set; } = null!;
        public string Description { get; set; } = null!;
        [Required]
        public string StreetAddress { get; set; } = null!;
        [Required]
        public string City { get; set; } = null!;
        [Required]
        public string Country { get; set; } = null!;
        public string? POBox { get; set; }
        [Required]
        public string PhoneNumber { get; set; } = null!;
        [Required, EmailAddress]
        public string Email { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        public double Rating { get; set; } = 0.0;
        public string EstimatedDeliveryTime { get; set; } = "15-20 min";
        public string Location { get; set; } = null!;
        public ICollection<Menu> Menus { get; set; } = new List<Menu>();
    }
}
