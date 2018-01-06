using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.HomeRepository;

namespace HopAmNhacThanh.Controllers
{
    public class WebViewController : Controller
    {
        private readonly IHomeRepository _repostitory;
        public WebViewController(IHomeRepository repository)
        {
            _repostitory = repository;
        }
        [Route("bai-hat/fullscreen/{slug}/{slugVersion}")]
        public async Task<IActionResult> Index(string slug, string slugVersion)
        {
            await _repostitory.IncreaseView(slug);
            ViewData["MainSingle"] = await _repostitory.GetMainSingle(slug, slugVersion);
            return View();
        }
    }
}