using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.SingleSongRepository;
using HopAmNhacThanh.Data.SidebarRepository;

namespace HopAmNhacThanh.Controllers
{
    public class SingleSongController : Controller
    {
        private const int PAGE_SIZE = 20;
        private readonly ISingleSongRepository _repository;
        private readonly ISidebarRepository _sidebarRepository;

        public SingleSongController(ISingleSongRepository repository,
            ISidebarRepository sidebarRepository)
        {
            _repository = repository;
            _sidebarRepository = sidebarRepository;
        }

        [Route("ca-sy/{slug}")]
        public async Task<IActionResult> Single(string slug, int? page)
        {
            if (!page.HasValue)
                page = 1;
            ViewData["Single"] = await _repository.GetSingleSingleSong(slug, page.Value, PAGE_SIZE);
            return View();
        }

        [Route("ca-sy")]
        public async Task<IActionResult> List(
    int? page)
        {
            int pageSize = PAGE_SIZE;
            if (!page.HasValue)
                page = 1;

            ViewData["List"] = await _repository.GetListSingleSong(page.Value, pageSize);
            return View();
        }
    }
}