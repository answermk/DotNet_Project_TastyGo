using Pro.Admin.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Pro.Admin.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Menu> Menus { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<CustomerSupport> CustomerSupports { get; set; }
        public DbSet<Customer> Customers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships and constraints
            modelBuilder.Entity<Restaurant>()
                .HasMany(r => r.Menus)
                .WithOne(m => m.Restaurant)
                .HasForeignKey(m => m.RestaurantId);

            modelBuilder.Entity<Order>()
                .HasMany(o => o.OrderItems)
                .WithOne(oi => oi.Order)
                .HasForeignKey(oi => oi.OrderId);

            modelBuilder.Entity<CustomerSupport>()
                .HasOne(cs => cs.Customer)
                .WithMany()
                .HasForeignKey(cs => cs.CustomerId);

            modelBuilder.Entity<CustomerSupport>()
                .HasOne(cs => cs.Order)
                .WithMany()
                .HasForeignKey(cs => cs.OrderId)
                .IsRequired(false);

            // Seed initial data if needed
            modelBuilder.Entity<Restaurant>().HasData(
                new Restaurant { Id = 1, Name = "B.King", Category = "Fast Food" },
                new Restaurant { Id = 2, Name = "Sushi E.", Category = "Japanese" }
            );
        }
    }
}