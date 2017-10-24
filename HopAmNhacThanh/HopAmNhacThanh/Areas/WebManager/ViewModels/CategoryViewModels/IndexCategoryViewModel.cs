using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.CategoryViewModels
{
    public class IndexCategoryViewModel : PageListItemTemplate
    {
        public List<Category> List { get; set; }
    }
}
