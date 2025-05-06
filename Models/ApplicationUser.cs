
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace OurTastyGo.Models
{
   

    public class ApplicationUser : IdentityUser
    {
        // Additional properties for your user
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        // Navigation property for user permissions
        public virtual ICollection<UserPermission>? UserPermissions { get; set; }

        // MFA related properties
        public bool TwoFactorEnabled { get; set; }
        public string? TwoFactorSecret { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
