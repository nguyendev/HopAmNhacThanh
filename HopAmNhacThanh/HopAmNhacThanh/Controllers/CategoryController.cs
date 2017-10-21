using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Controllers
{
    public class CategoryController : Controller
    {
        [Route("danh-muc")]
        public IActionResult List()
        {
            return View();
        }
        [Route("danh-muc/{slug}")]
        public IActionResult Single(string slug)
        {
            return View();
        }
    }
}