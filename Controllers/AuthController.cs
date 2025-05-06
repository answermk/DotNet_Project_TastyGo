using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OurTastyGo.DOTs;
using OurTastyGo.Models;
using OurTastyGo.Repositories;

namespace OurTastyGo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IMapper mapper,
        IConfiguration configuration,
        RoleManager<IdentityRole> roleManager) : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
        private readonly IMapper _mapper = mapper;
        private readonly IConfiguration _configuration = configuration;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly IEmailService _emailService;

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            var user = _mapper.Map<ApplicationUser>(userRegisterDto);

            var result = await _userManager.CreateAsync(user, userRegisterDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Generate email confirmation token if needed
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            return Ok(new { Message = "Registration successful", UserId = user.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email);

            if (user == null)
            {
                return Unauthorized("Invalid login attempt");
            }

            // Check if password is correct
            var result = await _signInManager.PasswordSignInAsync(
                userLoginDto.Email,
                userLoginDto.Password,
                userLoginDto.RememberMe,
                lockoutOnFailure: true);

            if (result.RequiresTwoFactor)
            {
                // Generate and send OTP
                var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email"); // or "Phone"

                // In a real app, you would send this token via email/SMS
                return Ok(new { RequiresTwoFactor = true, Token = token });
            }

            if (!result.Succeeded)
            {
                if (result.IsLockedOut)
                {
                    return Unauthorized("Account locked out");
                }
                return Unauthorized("Invalid login attempt");
            }

            return Ok(new { Message = "Login successful" });
        }

        [HttpPost("verify-two-factor")]
        public async Task<IActionResult> VerifyTwoFactor(string token, string provider = "Email")
        {
            var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
            if (user == null)
            {
                return BadRequest("Unable to load two-factor authentication user.");
            }

            var result = await _signInManager.TwoFactorSignInAsync(
                provider,
                token,
                isPersistent: false,
                rememberClient: false);

            if (result.Succeeded)
            {
                return Ok(new { Message = "Two-factor authentication successful" });
            }

            return Unauthorized("Invalid two-factor code");
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { Message = "Logout successful" });
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var profileDto = _mapper.Map<UserProfileDto>(user);

            // Get user permissions
            var permissions = await _userManager.GetClaimsAsync(user);
            profileDto.Permissions = permissions.Select(c => c.Value).ToList();

            return Ok(profileDto);
        }

        [HttpPost("enable-mfa")]
        public async Task<IActionResult> EnableMfa()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            await _userManager.SetTwoFactorEnabledAsync(user, true);
            user.TwoFactorSecret = Guid.NewGuid().ToString(); // In real app, use a proper secret
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "MFA enabled successfully" });
        }

        [HttpPost("disable-mfa")]
        public async Task<IActionResult> DisableMfa()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            await _userManager.SetTwoFactorEnabledAsync(user, false);
            user.TwoFactorSecret = null;
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "MFA disabled successfully" });
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // Don't reveal that the user doesn't exist or isn't confirmed
                return Ok(new { Message = "If your email is registered, you'll receive a password reset link." });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var callbackUrl = Url.Action("ResetPassword", "Auth",
                new { email = forgotPasswordDto.Email, token = token },
                protocol: HttpContext.Request.Scheme);

            await _emailService.SendEmailAsync(
                forgotPasswordDto.Email,
                "Reset Password",
                $"Please reset your password by clicking here: <a href='{callbackUrl}'>link</a>");

            return Ok(new { Message = "Password reset link has been sent to your email." });
        }
        [HttpGet("reset-password")]
        public IActionResult ResetPassword(string email, string token)
        {
            // This endpoint is typically used by a frontend to display the reset password form
            // The actual password reset is handled by the POST endpoint below
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(token))
            {
                return BadRequest("Invalid password reset token");
            }

            var model = new ResetPasswordDto { Email = email, Token = token };
            return Ok(new
            {
                Message = "Please reset your password",
                Data = model
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                // Don't reveal that the user doesn't exist
                return Ok(new { Message = "Password reset successful" });
            }

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.NewPassword);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return BadRequest(ModelState);
            }

            // Optional: If you want to automatically sign the user in after password reset
            // await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(new { Message = "Password has been reset successfully" });
        }
    }
}
