using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.ChordViewModels
{
    public class CreateChordViewModel
    {
        public long SongID { get; set; }
        public Song Song { get; set; }
        [StringLength(60, MinimumLength = 3)]
        [Display(Name = "Tên phiên bản")]
        public string Version { get; set; }
        [Display(Name = "Thông tin mô tả ngắn")]
        [StringLength(30, MinimumLength = 3)]
        public string InfoShort { get; set; }
        [Display(Name = "Thông tin đầy đủ")]
        public string Info { get; set; }
        [Display(Name = "Điệu")]
        public int? StyleID { get; set; }
        public Style Style { get; set; }
        [StringLength(5)]
        [Display(Name = "Tông chủ")]
        public string Tone { get; set; }
        [Display(Name = "Lời và hợp âm bài hát")]
        public string Lyric { get; set; }
        [Display(Name = "Intro")]
        public string Intro { get; set; }
        public string Note { get; set; }
    }
}
