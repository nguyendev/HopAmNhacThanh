using HopAmNhacThanh.Areas.WebManager.ViewModels.CategoryViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface ICategoryManagerRepository
    {
        Task<Category> Get(long? id);
        bool Exists(long id);
        Task<IndexCategoryViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(Category model);
        Task<Category> GetEdit(long? ID);
        Task Update(Category model);
        Task<Category> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
    }
}
