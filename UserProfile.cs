using AutoMapper;
using OurTastyGo.DOTs;
using OurTastyGo.Models;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UserRegisterDto, ApplicationUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

        CreateMap<ApplicationUser, UserProfileDto>();
    }
}