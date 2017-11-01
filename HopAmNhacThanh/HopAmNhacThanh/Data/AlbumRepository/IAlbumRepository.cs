using HopAmNhacThanh.Models.AlbumViewModels;
using HopAmNhacThanh.Models.CommonViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.AlbumRepository
{
    public interface IAlbumRepository
    {
        Task<CommonListViewModel> GetListAlbum(int page, int size);
        Task<CommonSingleViewModel> GetSingleAlbum(string slug, int page, int pageSize);
    }
}
