using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.VietnameseLyricViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface IVietnameseLyricsManagerRepository
    {
        Task<VietnameseLyric> Get(long? id);
        bool Exists(long id);
        Task<IndexVietnameseLyricViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(CreateVietnameseLyricViewModel model);
        Task<EditVietnameseLyricViewModel> GetEdit(long? ID);
        Task Update(EditVietnameseLyricViewModel model);
        Task<VietnameseLyric> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
    }
}