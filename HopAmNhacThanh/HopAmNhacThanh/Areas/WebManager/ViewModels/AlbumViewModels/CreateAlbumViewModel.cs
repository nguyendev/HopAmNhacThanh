using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.AlbumViewModels
{
    public class CreateAlbumViewModel
    {
        public string Name { get; set; }
        public string ShortName { get; set; }
        public string Description { get; set; }
        public int? ImageID { get; set; }
        public Images Image { get; set; }
        public string Content { get; set; }
    }
}
