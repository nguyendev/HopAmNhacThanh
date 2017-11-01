using HopAmNhacThanh.Models.CommonViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.CategoryRepository
{
    public interface ICategoryRepository
    {
        Task<CommonListViewModel> GetListCategory(int page, int size);
        Task<CommonSingleViewModel> GetSingleCategory(string slug, int page, int pageSize);
    }
}
