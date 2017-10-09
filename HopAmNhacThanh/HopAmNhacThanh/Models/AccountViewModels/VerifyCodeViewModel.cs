﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HopAmNhacThanh.Models.AccountViewModels
{
    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        public string Code { get; set; }

        public string ReturnUrl { get; set; }

        [Display(Name = "ReApplicationUser this browser?")]
        public bool ReApplicationUserBrowser { get; set; }

        [Display(Name = "ReApplicationUser me?")]
        public bool ReApplicationUserMe { get; set; }
    }
}
