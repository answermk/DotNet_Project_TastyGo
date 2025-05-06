using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OurTastyGo.Models;
using System.Security.Claims;

namespace OurTastyGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PermissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public PermissionsController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignPermission(string userId, string permissionName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var permission = await _context.Permissions.FirstOrDefaultAsync(p => p.Name == permissionName);
            if (permission == null)
            {
                return NotFound("Permission not found");
            }

            // Check if user already has this permission
            var existingPermission = await _context.UserPermissions
                .FirstOrDefaultAsync(up => up.UserId == userId && up.PermissionId == permission.Id);

            if (existingPermission != null)
            {
                return BadRequest("User already has this permission");
            }

            // Add permission
            _context.UserPermissions.Add(new UserPermission
            {
                UserId = userId,
                PermissionId = permission.Id
            });

            await _context.SaveChangesAsync();

            // Also add as a claim for immediate use
            await _userManager.AddClaimAsync(user, new Claim("Permission", permission.Name));

            return Ok(new { Message = "Permission assigned successfully" });
        }

        [HttpPost("revoke")]
        public async Task<IActionResult> RevokePermission(string userId, string permissionName)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var permission = await _context.Permissions.FirstOrDefaultAsync(p => p.Name == permissionName);
            if (permission == null)
            {
                return NotFound("Permission not found");
            }

            var userPermission = await _context.UserPermissions
                .FirstOrDefaultAsync(up => up.UserId == userId && up.PermissionId == permission.Id);

            if (userPermission == null)
            {
                return BadRequest("User doesn't have this permission");
            }

            _context.UserPermissions.Remove(userPermission);
            await _context.SaveChangesAsync();

            // Remove the claim
            var claims = await _userManager.GetClaimsAsync(user);
            var claimToRemove = claims.FirstOrDefault(c => c.Type == "Permission" && c.Value == permission.Name);
            if (claimToRemove != null)
            {
                await _userManager.RemoveClaimAsync(user, claimToRemove);
            }

            return Ok(new { Message = "Permission revoked successfully" });
        }

        [HttpGet("user-permissions/{userId}")]
        public async Task<IActionResult> GetUserPermissions(string userId)
        {
            var permissions = await _context.UserPermissions
                .Where(up => up.UserId == userId)
                .Include(up => up.Permission)
                .Select(up => up.Permission.Name)
                .ToListAsync();

            return Ok(permissions);
        }
    }
}

