using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Areas.APIManager.Controllers
{
    public class AudioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}