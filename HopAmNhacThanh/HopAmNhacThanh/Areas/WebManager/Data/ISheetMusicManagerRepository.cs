using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SheetMusicViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface ISheetMusicManagerRepository
    {
        Task<SheetMusic> Get(long? id);
        bool Exists(long id);
        Task<IndexSheetMusicViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<EditSheetMusicViewModel> GetEdit(long? ID);
        Task Update(EditSheetMusicViewModel model);
        Task<SheetMusic> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
        Task<PublishDTViewModels> GetEditPublishDT(long? ID);
        Task UpdatePublishDT(PublishDTViewModels model);
        // Save and Edit Approved
        Task<ApprovedViewModels> GetEditApproved(long? ID);
        Task UpdateApproved(ApprovedViewModels model);
    }
}