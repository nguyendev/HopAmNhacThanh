using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.CommonViewModels
{
    public class CommonListViewModel : PageListItemTemplate
    {
        public List<CommonSimpleViewModel> List { get; set; }
    }
}
