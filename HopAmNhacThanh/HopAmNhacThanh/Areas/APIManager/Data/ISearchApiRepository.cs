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
        Task<PaginatedList<SimpleSongViewModel>> GetSearch(string searchString, int page, int pageSize);
        
    }
}
