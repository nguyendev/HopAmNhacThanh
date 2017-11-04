using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.VideoViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface IVideoManagerRepository
    {
        Task<Video> Get(long? id);
        bool Exists(long id);
        Task<IndexVideoViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(Video model);
        Task<Video> GetEdit(long? ID);
        Task Update(Video model);
        Task<Video> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
    }
}
