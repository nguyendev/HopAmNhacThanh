using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Controllers
{
    public class StyleController : Controller
    {
        [Route("dieu")]
        public IActionResult List()
        {
            return View();
        }
        [Route("dieu/{slug}")]
        public IActionResult Single()
        {
            return View();
        }
    }
}