using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models
{
    public class PageListItemTemplate
    {
        public int PageIndex { get; set; }
        public int TotalPages { get; set; }

        public int PageSize { get; set; }
        public string Areas { get; set; }
        public string Controller { get; set; }
        public string Action { get; set; }
        public int Count { get; set; }
        public bool HasPreviousPage
        {
            get
            {
                return (PageIndex > 1);
            }
        }
        public bool HasNextPage
        {
            get
            {
                return (PageIndex < TotalPages);
            }
        }
    }
}
