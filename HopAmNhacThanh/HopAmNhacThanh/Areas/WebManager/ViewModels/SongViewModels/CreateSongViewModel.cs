using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels
{
    public class CreateSongViewModel
    {
        [StringLength(60, MinimumLength = 3)]
        [Required]
        [Display(Name = " Tên bài hát")]

        public string Name { get; set; }
        [MaxLength(60)]
        [Display(Name = " Tên khác")]
        public string OrtherName { get; set; }
        [Display(Name = " Thể loại")]
        [Required]
        public int CategoryID { get; set; }
        public Category Category { get; set; }
        [Display(Name = "Album")]
        public int? AlbumID { get; set; }
        public Album Album { get; set; }
        [Display(Name = "Số thứ tự bài hát trong Album")]
        public int? NumberSongInAlbum { get; set; }
        [Display(Name = "Tác giả")]
        public int? AuthorSongID { get; set; }
        public AuthorSong AuthorSong { get; set; }
        [Display(Name = "Lời việt")]
        public int? VietnameseLyricID { get; set; }
        public VietnameseLyric VietnameseLyric { get; set; }
        [Display(Name = "Năm xuất bản")]
        public string YearPublish { get; set; }
        public string Note { get; set; }
    }
}
