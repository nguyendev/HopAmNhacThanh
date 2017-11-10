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
        #region Common Sidebar
        Task<List<BestSimpleSongViewModel>> GetListTopSong();
        Task<List<SimpleCategoryViewModel>> GetListCategory();
        Task<List<SimpleStyleViewModel>> GetListStyle();
        Task<List<SimpleAlbumViewModel>> GetListAlbum();

        Task<CommonSidebarViewModel> GetCommonSidebar();
        #endregion

        #region Single Song
        Task<List<SimpleSongInAblumViewModel>> GetListSongInCategory(int CategoryID);
        Task<List<SimpleSongInAblumViewModel>> GetListSongInAlbum(int? AlbumID);
        Task<List<SimpleLinkSongViewModel>> GetListLinkSong(long songID);
        Task<List<SimpleVideoViewModel>> GetListVideo(long songID);
        Task<SingleSongSidebarViewModel> GetSingleSong(string slugSong, string slugVersion);
        
        #endregion
    }
}