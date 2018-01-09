using HopAmNhacThanh.Areas.APIManager.ViewModels;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface ISongApiRepository
    {
        Task<PaginatedList<SimpleSongApiViewModel>> GetPopulars(int page, int pageSize);
        Task<PaginatedList<SimpleSongApiViewModel>> GetNews(int page, int pageSize);
        Task<MainSingleViewModel> GetSingle(string slugSong, string slugVersion);
    }
}
