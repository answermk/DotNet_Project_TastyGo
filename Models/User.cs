namespace OurTastyGo.Models
{
    public class User
    {
        public int Id { get; set; }  // Primary Key
        public required string FullName { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required string PasswordHash { get; set; }
        public string? OtpCode { get; set; }
        public DateTime? OtpExpiryTime { get; set; }
        public bool IsOtpVerified { get; set; } = false;
        public DateTime OtpGeneratedAt { get; internal set; }

        public  ICollection<UserPermission>? UserPermissions { get; set; }

    }
}
