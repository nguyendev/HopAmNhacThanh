using HopAmNhacThanh.Areas.APIManager.ViewModels;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface ISearchApiRepository
    {
        Task<PaginatedList<SimpleSongApiViewModel>> GetSearch(string searchString, int page, int pageSize);
        
    }
}
