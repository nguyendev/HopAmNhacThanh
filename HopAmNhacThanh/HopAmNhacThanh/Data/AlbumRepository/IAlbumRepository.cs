using HopAmNhacThanh.Models.AlbumViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.AlbumRepository
{
    public interface IAlbumRepository
    {
        Task<ListAlbumViewModel> GetListAlbum(int page, int size);
        Task<SingleAlbumViewModel> GetSingleAlbum(string slug);
    }
}
