using HopAmNhacThanh.Models;
using HopAmNhacThanh.Models.SheetMusicViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface ISheetApiRepository
    {
        Task<SingleSheetMusicViewModel> GetSingle(string slug);
    }
}
