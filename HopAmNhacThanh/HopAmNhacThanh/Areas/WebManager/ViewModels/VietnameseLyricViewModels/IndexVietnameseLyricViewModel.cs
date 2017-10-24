using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.VietnameseLyricViewModels
{
    public class IndexVietnameseLyricViewModel : PageListItemTemplate
    {
        public List<VietnameseLyric> List { get; set; }
    }
}
