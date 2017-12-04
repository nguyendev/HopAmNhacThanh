using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.AutoGetTool.ViewModels
{
    public class SearchViewModel
    {
        public string Title { get; set; }

        public string Description { get; set; }
        public string Link { get; set; }

        public SearchViewModel(string Title, string Description, string Link)
        {
            this.Title = Title;
            this.Description = Description;
            try
            {
                int temp = Link.LastIndexOf("/url?q=");
                Link = Link.Substring(Link.IndexOf("=") + 1);
                this.Link = Link.Substring(0, Link.IndexOf("&"));
            }
            catch
            {
                this.Link = Link;
            }
        }

    }
}
