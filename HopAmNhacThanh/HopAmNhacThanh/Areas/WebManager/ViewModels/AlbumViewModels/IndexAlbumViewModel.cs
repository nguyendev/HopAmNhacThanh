using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.AlbumViewModels
{
    public class IndexAlbumViewModel : PageListItemTemplate
    {
        public List<SimpleIndexAlbumViewModel> ListAlbum { get; set; }
    }

    public class SimpleIndexAlbumViewModel : BaseIndexViewModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
    }
}
