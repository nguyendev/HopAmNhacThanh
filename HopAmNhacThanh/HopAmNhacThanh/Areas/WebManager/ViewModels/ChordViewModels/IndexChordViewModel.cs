using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HopAmNhacThanh.Models;
using System.ComponentModel.DataAnnotations;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.ChordViewModels
{
    public class IndexChordViewModel : PageListItemTemplate
    {
        public List<SimpleIndexChordViewModel> ListChord { get; set; }
    }
    public class SimpleIndexChordViewModel : BaseIndexViewModel
    {
        public long ID { get; set; }
        public long SongID { get; set; }
        public Song Song { get; set; }
        [StringLength(60, MinimumLength = 3)]
        [Display(Name = "Tên phiên bản")]
        public string Version { get; set; }
        [StringLength(30, MinimumLength = 3)]
        [Display(Name = "Điệu")]
        public int? StyleID { get; set; }
        public Style Style { get; set; }
        [StringLength(5)]
        [Display(Name = "Tông chủ")]
        public string Tone { get; set; }

    }
}
