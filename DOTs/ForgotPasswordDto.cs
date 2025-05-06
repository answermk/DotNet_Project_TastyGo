using System.ComponentModel.DataAnnotations;

namespace OurTastyGo.DOTs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
    }
}
