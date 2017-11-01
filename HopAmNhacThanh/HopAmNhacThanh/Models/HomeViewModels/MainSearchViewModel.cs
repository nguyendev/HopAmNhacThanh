using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.HomeViewModels
{
    public class MainSearchViewModel : PageListItemTemplate
    {
        public string Search { get; set; }
        public IEnumerable<SimpleSongViewModel> ListSong { get; set; }
    }
}
