using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.DashboardViewModels
{
    public class DashboardViewModels
    {
        public int CountApplicationUserInDay { get; set; }
        public int CountApplicationUserInWeek { get; set; }
        public int CountApplicationUserInMonth { get; set; }
        public int CountApplicationUserTotal { get; set; }

        public int CountSingleQuestionInDay { get; set; }
        public int CountSingleQuestionInWeek { get; set; }
        public int CountSingleQuestionInMonth { get; set; }
        public int CountSingleQuestionTotal { get; set; }

        public int CountMultiQuestionInDay { get; set; }
        public int CountMultiQuestionInWeek { get; set; }
        public int CountMultiQuestionInMonth { get; set; }
        public int CountMultiQuestionTotal { get; set; }

        public int CountLikePuzzleInDay { get; set; }
        public int CountLikePuzzleInWeek { get; set; }
        public int CountLikePuzzleInMonth { get; set; }
        public int CountLikePuzzleTotal { get; set; }

        public int CountViewPuzzleInDay { get; set; }
        public int CountViewPuzzleInWeek { get; set; }
        public int CountViewPuzzleInMonth { get; set; }
        public int CountViewPuzzleTotal { get; set; }
    }
}
