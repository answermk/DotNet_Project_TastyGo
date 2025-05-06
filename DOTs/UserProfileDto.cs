namespace OurTastyGo.DOTs
{
    public class UserProfileDto
    {
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public List<string>? Permissions { get; set; }
    }
}
