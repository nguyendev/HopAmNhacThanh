using HopAmNhacThanh.Areas.APIManager.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface ICategoryApiRepository
    {
        Task<List<SimpleCategoryApiViewModel>> GetList();
        Task<SingleCategoryApiViewModel> GetSingle(string slug);
    }
}
