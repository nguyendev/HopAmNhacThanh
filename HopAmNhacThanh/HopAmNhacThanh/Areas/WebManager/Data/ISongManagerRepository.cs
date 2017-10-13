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
        Task<Song> Get(int? id);
        bool Exists(int id);
        Task<PaginatedList<Song>> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task Create(CreateSongViewModels model, ApplicationUser user);
        Task<EditSongViewModels> GetEdit(int? ID);
        Task Update(EditSongViewModels model);
        Task Delete(long id);

        // Save and Edit Publish Datetime
        Task<PublishDTSongViewModels> GetEditPublishDT(int? ID);
        Task UpdatePublishDT(PublishDTSongViewModels model);

        // Save and Edit Approved
        Task<ApprovedViewModels> GetEditApproved(int? ID);
        Task UpdateApproved(ApprovedViewModels model);
    }

}
