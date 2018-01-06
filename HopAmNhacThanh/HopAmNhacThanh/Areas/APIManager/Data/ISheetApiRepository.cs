using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.APIManager.Data
{
    public interface ISheetApiRepository
    {
        Task<List<SheetMusic>> GetSheet(string slug);
    }
}
