using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels
{
    public class IndexSongViewModel : PageListItemTemplate
    {
        
        public List<SimpleIndexSongViewModel> ListSong { get; set; }
    }

    public class SimpleIndexSongViewModel: BaseIndexViewModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public long ID { get; set; }
        [StringLength(60, MinimumLength = 3)]
        [Required]
        [Display(Name = " Tên bài hát")]

        public string Name { get; set; }
        [Display(Name = " Thể loại")]
        [Required]
        public int CategoryID { get; set; }
        public Category Category { get; set; }
        [Display(Name = "Album")]
        public int? AlbumID { get; set; }
        public Album Album { get; set; }
        [Display(Name = "Lượt xem")]
        public int Views { get; set; }
    }
}
