using HopAmNhacThanh.Models.HomeViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.CommonViewModels
{
    public class CommonSingleViewModel : PageListItemTemplate
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int? ImageID { get; set; }
        public Images Image { get; set; }
        public string Content { get; set; }
        public string Slug { get; set; }
        public List<SimpleSongViewModel> ListSong { get; set; }
    }
}
