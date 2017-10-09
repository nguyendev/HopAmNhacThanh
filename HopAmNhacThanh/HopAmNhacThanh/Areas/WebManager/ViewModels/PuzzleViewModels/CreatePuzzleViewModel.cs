using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Areas.WebManager.ViewModels.PuzzleViewModels
{
    public enum Type { MultipleChoice, MultipleChoiceWithImage }
    public class CreatePuzzleViewModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int ID { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Slug { get; set; }

        [Required]
        public int NumberQuestion { get; set; }
        public string Image { get; set; }

        [Required]
        public Type Type{ get; set; }

        
        public int Level { get; set; }

        public int MaxScore { get; set; }


        public CreatePuzzleViewModel()
        {

        }
    }
}
