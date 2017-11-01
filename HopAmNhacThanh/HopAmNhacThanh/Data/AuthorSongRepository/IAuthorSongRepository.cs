using HopAmNhacThanh.Models.CommonViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.AuthorSongRepository
{
    public interface IAuthorSongRepository
    {
        Task<CommonListViewModel> GetListAuthorSong(int page, int size);
        Task<CommonSingleViewModel> GetSingleAuthorSong(string slug, int page, int pageSize);
    }
}
