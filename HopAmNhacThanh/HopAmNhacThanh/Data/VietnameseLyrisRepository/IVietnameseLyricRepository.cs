using HopAmNhacThanh.Models.CommonViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.VietnameseLyrisRepository
{
    public interface IVietnameseLyricRepository
    {
        Task<CommonListViewModel> GetListVietnameseLyric(int page, int size);
        Task<CommonSingleViewModel> GetSingleVietnameseLyric(string slug, int page, int pageSize);
    }
}
