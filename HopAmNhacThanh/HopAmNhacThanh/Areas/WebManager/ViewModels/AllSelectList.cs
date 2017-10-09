using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels
{
    public class AllSelectList
    {
        public List<Approved> ListApproved { get; set; }
        public AllSelectList()
        {
            Approved A = new Approved("A", "Đã duyệt");
            Approved U = new Approved("U", "Chưa duyệt");
            ListApproved = new List<Approved>();
            ListApproved.Add(A);
            ListApproved.Add(U);
        }
    }

    public class Approved
    {
        public string ID { get; set; }

        public string Name { get; set; }

        public Approved(string Id, string Text)
        {
            this.ID = Id;
            this.Name = Text;
        }
    }
}
