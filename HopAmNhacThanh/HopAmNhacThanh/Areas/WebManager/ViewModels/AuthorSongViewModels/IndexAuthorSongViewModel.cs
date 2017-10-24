using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.AuthorSongViewModels
{
    public class IndexAuthorSongViewModel : PageListItemTemplate
    {
        public List<AuthorSong> List { get; set; }
    }
}
