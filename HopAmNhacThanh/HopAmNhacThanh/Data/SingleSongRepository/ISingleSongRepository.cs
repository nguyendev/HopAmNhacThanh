using HopAmNhacThanh.Models.CommonViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.SingleSongRepository
{
    public interface ISingleSongRepository
    {
        Task<CommonListViewModel> GetListSingleSong(int page, int size);
        Task<CommonSingleViewModel> GetSingleSingleSong(string slug, int page, int pageSize);
    }
}
