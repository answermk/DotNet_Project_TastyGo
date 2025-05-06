using System.Reflection.Emit;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using OurTastyGo.Models;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Permission> Permissions { get; set; }
    public DbSet<UserPermission> UserPermissions { get; set; }
    public DbSet<Restaurant> Restaurants { get; set; }
    public DbSet<UserPreferences> UserPreferences { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {

        base.OnModelCreating(builder);

        builder.Entity<Restaurant>().ToTable("Restaurants");

        // Configure the many-to-many relationship
        builder.Entity<UserPermission>()
            .HasKey(up => new { up.UserId, up.PermissionId });

        builder.Entity<UserPreferences>()
           .HasKey(up => up.UserId);

        builder.Entity<UserPermission>()
            .HasOne(up => up.User)
            .WithMany(u => u.UserPermissions)
            .HasForeignKey(up => up.UserId);

        builder.Entity<UserPermission>()
            .HasOne(up => up.Permission)
            .WithMany(p => p.UserPermissions)
            .HasForeignKey(up => up.PermissionId);
    }
}