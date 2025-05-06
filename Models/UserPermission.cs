using System.Security;

namespace OurTastyGo.Models
{
    public class UserPermission
    {
        public string? UserId { get; set; }
        public int PermissionId { get; set; }

        // Navigation properties
        public virtual ApplicationUser? User { get; set; }
        public virtual Permission? Permission { get; set; }
    }
}
