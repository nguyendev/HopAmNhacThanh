using HopAmNhacThanh.Models.SidebarViewModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.SidebarRepository
{
    public interface ISidebarRepository
    {
        Task<List<BestSimpleSongViewModel>> GetListTopSong();
        Task<List<SimpleCategoryViewModel>> GetListCategory();
        Task<List<SimpleStyleViewModel>> GetListStyle();
        Task<List<SimpleAlbumViewModel>> GetListAlbum();

        Task<CommonSidebarViewModel> GetCommonSidebar();
    }
}
