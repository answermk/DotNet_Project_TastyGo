using Microsoft.AspNetCore.Authorization;

namespace OurTastyGo
{
    public class PermissionAttribute : AuthorizeAttribute
    {
         public PermissionAttribute(string permission)
        : base(permission)
        {
            Policy = permission;
        }
    }
}

