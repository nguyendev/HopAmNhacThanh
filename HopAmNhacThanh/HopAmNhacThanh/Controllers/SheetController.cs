using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Controllers
{
    public class SheetController : Controller
    {
        [Route("/sheet/{slug}")]
        public IActionResult Single(string slug)
        {
            return View();
        }
    }
}