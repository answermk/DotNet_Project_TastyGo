namespace OurTastyGo.Models
{
    public class Permission
    {
        public int Id { get; set; }
        public string? Name { get; set; } // e.g., "EditArticles", "ViewReports"
        public string? Description { get; set; }

        // Navigation property
        public virtual ICollection<UserPermission>? UserPermissions { get; set; }
    }
}
