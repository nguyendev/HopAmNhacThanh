using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface ISongManagerRepository
    {
        Task<Song> Get(long? id);
        bool Exists(long id);
        Task<IndexSongViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> CreateFull(CreateSongFullViewModels model, ApplicationUser user);
        Task<bool> Create(CreateSongViewModel model, ApplicationUser user);
        Task<EditSongViewModels> GetEdit(long? ID);
        Task Update(EditSongViewModels model);
        Task<Song> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
        Task<PublishDTViewModels> GetEditPublishDT(long? ID);
        Task UpdatePublishDT(PublishDTViewModels model);
        // Save and Edit Approved
        Task<ApprovedViewModels> GetEditApproved(long? ID);
        Task UpdateApproved(ApprovedViewModels model);
    }

}
