using HopAmNhacThanh.Models.SheetMusicViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Data.SheetMusicRepository
{
    public interface ISheetMusicRepository
    {
        Task<SingleSheetMusicViewModel> GetSingle(string slug);
    }
}
