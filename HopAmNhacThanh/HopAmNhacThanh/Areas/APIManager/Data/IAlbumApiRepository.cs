using HopAmNhacThanh.Models.CommonViewModels;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Models.SidebarViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface IAlbumApiRepository
    {
        Task<List<SimpleAlbumViewModel>> GetListAlbum();
        Task<CommonSingleViewModel> GetSingleAlbum(string slug);
        Task<List<SimpleSongViewModel>> GetSearch(string searchString, string albumSlug);
    }
}
