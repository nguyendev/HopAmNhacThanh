using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Controllers
{
    public class AlbumController : Controller
    {
        [Route("album/{slug}")]
        public IActionResult Single(string slug)
        {
            return View();
        }
    }
}