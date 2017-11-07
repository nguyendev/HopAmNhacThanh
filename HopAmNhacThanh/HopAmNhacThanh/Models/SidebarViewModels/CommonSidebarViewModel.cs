using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.SidebarViewModels
{
    public class CommonSidebarViewModel
    {
        public List<BestSimpleSongViewModel> ListTopSong { get; set; }
        public List<SimpleCategoryViewModel> ListCategory { get; set; }
        public List<SimpleStyleViewModel> ListStyle { get; set; }
        public List<SimpleAlbumViewModel> ListAlbum { get; set; }

    }
    public class SimpleStyleViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
    }
    public class BestSimpleSongViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Views { get; set; }
        public string Version { get; set; }
    }

    public class SimpleAlbumViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Count { get; set; }
    }

    public class SimpleCategoryViewModel
    {
        public string Name { get; set; }
        public string Slug { get; set; }
        public int Count { get; set; }
    }
}
