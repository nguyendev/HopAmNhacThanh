using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels
{
    public class BaseIndexViewModel
    {
        [Display(Name = "Duyệt")]
        public string Approved { get; set; }
        [Display(Name = "Thời gian tạo")]
        public DateTime? CreateDT { get; set; }
    }
}
