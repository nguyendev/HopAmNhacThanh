using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.HomeRepository;
using HopAmNhacThanh.Models.HomeViewModels;

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
        public async Task<IActionResult> Song(string slug, string slugVersion)
        {
            await _repostitory.IncreaseView(slug);
            ViewData["MainSingle"] = await _repostitory.GetMainSingle(slug, slugVersion);
            return View();
        }

        [Route("sheet/mobile/{slug}")]
        public async Task<IActionResult> SheetMobile(string slug)
        {
            ViewData["MainSingle"] = await _repostitory.GetSheetMobile(slug);
            return View();
        }
        [Route("video/mobile/{slug}")]
        public async Task<IActionResult> VideoMobile(string slug)
        {
            List<SimpleVideoViewModel> applicationDbContext = await _repostitory.GetVideoMobile(slug);
            return View(applicationDbContext);
        }
        [Route("audio/mobile/{slug}")]
        public async Task<IActionResult> AudioMobile(string slug)
        {
            List<SimpleLinkSongViewModel> applicationDbContext = await _repostitory.GetAudioMobile(slug);
            return View(applicationDbContext);
        }
    }
}