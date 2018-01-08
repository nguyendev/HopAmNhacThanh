using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Models.SheetMusicViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.HomeRepository
{
    public interface IHomeRepository
    {
        Task<MainContentViewModel> GetMainHome();
        Task<MainContentViewModel> GetMainHome(char slug,int page,int pageSize);
        Task<MainSingleViewModel> GetMainSingle(string slugSong, string slugVersion);
        Task<MainSearchViewModel> GetSearch(string searchString,int page,int pageSize);
        Task<MainSearchViewModel> GetAphabet(char searchString, int page, int pageSize);
        Task IncreaseView(string slug);
        Task<String> FindSong(string slug);
        Task<SingleSheetMusicViewModel> GetSheetMobile(string slug);
        Task<List<SimpleLinkSongViewModel>> GetAudioMobile(string slug);
        Task<List<SimpleVideoViewModel>> GetVideoMobile(string slug);
    }
}
