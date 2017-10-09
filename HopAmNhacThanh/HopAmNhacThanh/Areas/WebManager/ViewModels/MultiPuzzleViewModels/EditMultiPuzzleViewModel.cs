using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.MultiPuzzleViewModels
{
    public class EditMultiPuzzleViewModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
        public int NumberQuestion { get; set; }
        public int? ImageID { get; set; }
        public string Approved { get; set; }
        public bool IsDeleted { get; set; }
        public string Note { get; set; }
    }
}
