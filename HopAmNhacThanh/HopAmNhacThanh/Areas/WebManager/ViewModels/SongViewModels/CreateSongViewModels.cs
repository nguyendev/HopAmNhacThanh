using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels
{
    public class CreateSongViewModels
    {
        [Display(Name = "Tên bài hát")]
        [MaxLength(60)]
        [Required]
        public string Name { get; set; }
        [MaxLength(60)]
        [Display(Name = "Tên khác")]
        public string OrtherName { get; set; }
        [Display(Name = "Slug")]
        [MaxLength(30)]
        [Required]
        public string Slug { get; set; }
        [Display(Name = " Thể loại")]
        [Required]
        public int CategoryID { get; set; }
        public Category Category { get; set; }
        [Display(Name = "Tác giả")]
        public int? AuthorSongID { get; set; }
        public AuthorSong AuthorSong { get; set; }
        [Display(Name = "Lời việt")]
        public int? VietnameseLyric { get; set; }
        [Display(Name = "Năm xuất bản")]
        public string YearPublish { get; set; }
    }
}
