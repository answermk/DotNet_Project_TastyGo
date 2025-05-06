using System.Net.Mail;
using System.Net;

namespace OurTastyGo.Repositories
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var smtpSettings = _configuration.GetSection("SmtpSettings");
            using (var client = new System.Net.Mail.SmtpClient(smtpSettings["Host"], int.Parse(smtpSettings["Port"])))
            {
                client.EnableSsl = true;
                client.Credentials = new System.Net.NetworkCredential(
                    smtpSettings["Username"],
                    smtpSettings["Password"]);

                var mailMessage = new System.Net.Mail.MailMessage
                {
                    From = new System.Net.Mail.MailAddress(
                        smtpSettings["FromAddress"],
                        smtpSettings["FromName"]),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
            }
        }
    }
    } 
