using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HopAmNhacThanh.Controllers
{
    public class AuthorChordsController : Controller
    {
        [Route("tac-gia-hop-am/{slug}")]
        public IActionResult Single()
        {
            return View();
        }
    }
}