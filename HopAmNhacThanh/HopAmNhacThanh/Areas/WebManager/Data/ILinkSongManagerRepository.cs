using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.LinkSongViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface ILinkSongManagerRepository
    {
        Task<LinkSong> Get(long? id);
        bool Exists(long id);
        Task<IndexLinkSongViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(CreateLinkSongViewModel model, ApplicationUser user);
        Task<EditLinkSongViewModel> GetEdit(long? ID);
        Task Update(EditLinkSongViewModel model);
        Task<LinkSong> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
        Task<PublishDTViewModels> GetEditPublishDT(long? ID);
        Task UpdatePublishDT(PublishDTViewModels model);
        // Save and Edit Approved
        Task<ApprovedViewModels> GetEditApproved(long? ID);
        Task UpdateApproved(ApprovedViewModels model);
    }
}
