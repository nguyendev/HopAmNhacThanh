using HopAmNhacThanh.Areas.WebManager.ViewModels.ChordViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface IChordManagerRepository
    {
        Task<Chords> Get(long? id);
        bool Exists(long id);
        Task<IndexChordViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(CreateChordViewModel model, ApplicationUser user);
        Task<EditChordViewModel> GetEdit(long? ID);
        Task Update(EditChordViewModel model);
        Task<Chords> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
        Task<PublishDTViewModels> GetEditPublishDT(long? ID);
        Task UpdatePublishDT(PublishDTViewModels model);
        // Save and Edit Approved
        Task<ApprovedViewModels> GetEditApproved(long? ID);
        Task UpdateApproved(ApprovedViewModels model);
    }
}
