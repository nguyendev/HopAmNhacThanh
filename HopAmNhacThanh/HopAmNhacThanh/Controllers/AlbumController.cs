using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.AlbumRepository;
using HopAmNhacThanh.Data.SidebarRepository;

namespace HopAmNhacThanh.Controllers
{
    public class AlbumController : Controller
    {
        private const int PAGE_SIZE = 20;
        private readonly IAlbumRepository _repository;
        private readonly ISidebarRepository _sidebarRepository;

        public AlbumController(IAlbumRepository repository,
            ISidebarRepository sidebarRepository)
        {
            _repository = repository;
            _sidebarRepository = sidebarRepository;
        }

        [Route("album/{slug}")]
        public async Task<IActionResult> Single(string slug, int? page)
        {
            if (!page.HasValue)
                page = 1;
            ViewData["Single"] = await _repository.GetSingleAlbum(slug, page.Value, PAGE_SIZE);
            return View();
        }

        [Route("album")]
        public async Task<IActionResult> List(
    int? page)
        {
            int pageSize = PAGE_SIZE;
            if (!page.HasValue)
                page = 1;

            ViewData["List"] = await _repository.GetListAlbum(page.Value, pageSize);
            return View();
        }
    }
}