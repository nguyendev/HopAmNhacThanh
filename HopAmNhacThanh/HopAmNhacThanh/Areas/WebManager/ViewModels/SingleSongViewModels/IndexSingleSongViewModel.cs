using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SingleSongViewModels
{
    public class IndexSingleSongViewModel : PageListItemTemplate
    {
        public List<SimpleIndexSingleSongViewModel> ListSingleSong { get; set; }
    }
    public class SimpleIndexSingleSongViewModel : BaseIndexViewModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ImageID { get; set; }
        public Images Image { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
    }
}
