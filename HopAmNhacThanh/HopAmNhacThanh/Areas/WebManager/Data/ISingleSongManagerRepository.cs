using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SingleSongViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface ISingleSongManagerRepository
    {
        Task<SingleSong> Get(long? id);
        bool Exists(long id);
        Task<IndexSingleSongViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(CreateSingleSongViewModel model, ApplicationUser user);
        Task<EditSingleSongViewModel> GetEdit(long? ID);
        Task Update(EditSingleSongViewModel model);
        Task<SingleSong> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
        Task<PublishDTViewModels> GetEditPublishDT(long? ID);
        Task UpdatePublishDT(PublishDTViewModels model);
        // Save and Edit Approved
        Task<ApprovedViewModels> GetEditApproved(long? ID);
        Task UpdateApproved(ApprovedViewModels model);
    }
}
