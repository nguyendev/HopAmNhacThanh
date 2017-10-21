using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.HomeViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.SongRepository
{
    public interface ISongRepository
    {
        Task AddNewVersionSong(AddNewVersionSong model, ApplicationUser user);
        Task ReportSong(ReportSongViewModel model);
    }
}
