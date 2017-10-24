﻿using HopAmNhacThanh.Areas.WebManager.ViewModels.AlbumViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.Data
{
    public interface IAlbumManagerRepository
    {
        Task<Album> Get(long? id);
        bool Exists(long id);
        Task<IndexAlbumViewModel> GetAll(string sortOrder, string searchString,
    int? page, int? pageSize);
        Task<bool> Create(CreateAlbumViewModel model, ApplicationUser user);
        Task<EditAlbumViewModel> GetEdit(long? ID);
        Task Update(EditAlbumViewModel model);
        Task<Album> Details(long? id);
        Task Delete(long id);
        // Save and Edit Publish Datetime
        Task<PublishDTViewModels> GetEditPublishDT(long? ID);
        Task UpdatePublishDT(PublishDTViewModels model);
        // Save and Edit Approved
        Task<ApprovedViewModels> GetEditApproved(long? ID);
        Task UpdateApproved(ApprovedViewModels model);
    }
}
