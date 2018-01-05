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
        Task<PaginatedList<SimpleSongViewModel>> GetPopulars(int page, int pageSize);
        Task<PaginatedList<SimpleSongViewModel>> GetNews(int page, int pageSize);
        Task<MainSingleViewModel> GetSingle(string slugSong, string slugVersion);
    }
}
