using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.VideoViewModels
{
    public class IndexVideoViewModel : PageListItemTemplate
    {
        public List<Video> List { get; set; }
    }
}
