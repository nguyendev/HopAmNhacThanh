using HopAmNhacThanh.Areas.APIManager.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface IAuthorSongApiRepository
    {
        Task<List<SimpleAuthorSongApiViewModel>> GetListAuthorSong();
        Task<SimpleAuthorSongApiViewModel> GetSingleAuthorSong(string slug);
    }
}
