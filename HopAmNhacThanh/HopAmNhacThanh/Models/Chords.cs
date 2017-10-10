using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class Chords : Base
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public long ID { get; set; }
        public int SongID { get; set; }
        [StringLength(60, MinimumLength = 3)]
        [Display(Name = "Tên phiên bản")]
        [Required]
        public string Version { get; set; }
        [StringLength(30, MinimumLength = 3)]
        [Display(Name = "Slug")]
        [Required]
        public string Slug { get; set; }
        [Display(Name = "Thông tin mô tả ngắn")]
        [StringLength(30, MinimumLength = 3)]
        [Required]
        public string InfoShort { get; set; }
        [Display(Name = "Thông tin đầy đủ")]
        public string Info { get; set; }
        [Display(Name = "Điệu")]
        public int? StyleID { get; set; }
        public Style Style { get; set; }
        [StringLength(5)]
        [Display(Name = "Tông chủ")]
        [Required]
        public string Tone { get; set; }
        [Display(Name = "Lời và hợp âm bài hát")]
        [Required]
        public string Lyric { get; set; }
    }
}
