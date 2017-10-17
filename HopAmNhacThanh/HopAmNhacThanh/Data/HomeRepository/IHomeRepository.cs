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

        Task<MainSingleViewModel> GetMainSingle(string slugSong, string slugVersion);
    }
}
