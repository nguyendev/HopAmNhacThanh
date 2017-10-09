using HopAmNhacThanh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.SinglePuzzleViewModels
{
    public class EditSinglePuzzleViewModels
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsMMultiPuzzle { get; set; }

        public int? MultiPuzzleID { get; set; }
        public string Slug { get; set; }
        public int? ImageID { get; set; }
        //public Images Image { get; set; }
        public bool IsYesNo { get; set; }
        public string AnswerA { get; set; }
        public string AnswerB { get; set; }
        public string AnswerC { get; set; }
        public string AnswerD { get; set; }
        public int Correct { get; set; }
        public string Reason { get; set; }
        public string TempTag { get; set; }
        public string Note { get; set; }

        public string Approved { get; set; }
        public string Active { get; set; }
        public bool IsDelete { get; set; }
    }
}
