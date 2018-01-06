using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface IAudioApiRepository
    {
        Task<PaginatedList<SimpleLinkSongViewModel>> GetSearch(string searchString, int page, int pageSize);
        Task<List<LinkSong>> GetAudio(string slug);
    }
}
