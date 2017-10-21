using HopAmNhacThanh.Models.HomeViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.HomeRepository
{
    public interface IHomeRepository
    {
        Task<MainContentViewModel> GetMainHome();
        Task<MainContentViewModel> GetMainHome(char slug,int page,int pageSize);
        Task<MainSingleViewModel> GetMainSingle(string slugSong, string slugVersion);
        Task<MainSearchViewModel> GetSearch(string searchString,int page,int pageSize);
    }
}
