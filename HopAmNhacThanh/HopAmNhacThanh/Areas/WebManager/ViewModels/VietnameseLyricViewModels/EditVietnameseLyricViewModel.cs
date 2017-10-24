using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.VietnameseLyricViewModels
{
    public class EditVietnameseLyricViewModel
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Slug { get; set; }
        public int? ImageID { get; set; }
        public Images Image { get; set; }
        public string Content { get; set; }
    }
}
