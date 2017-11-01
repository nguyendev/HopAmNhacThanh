using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.AuthorSongRepository;
using HopAmNhacThanh.Data.SidebarRepository;

namespace HopAmNhacThanh.Controllers
{
    public class AuthorSongController : Controller
    {
        private const int PAGE_SIZE = 20;
        private readonly IAuthorSongRepository _repository;
        private readonly ISidebarRepository _sidebarRepository;

        public AuthorSongController(IAuthorSongRepository repository,
            ISidebarRepository sidebarRepository)
        {
            _repository = repository;
            _sidebarRepository = sidebarRepository;
        }

        [Route("tac-gia-bai-hat/{slug}")]
        public async Task<IActionResult> Single(string slug, int? page)
        {
            if (!page.HasValue)
                page = 1;
            ViewData["Single"] = await _repository.GetSingleAuthorSong(slug, page.Value, PAGE_SIZE);
            return View();
        }

        [Route("tac-gia-bai-hat")]
        public async Task<IActionResult> List(
    int? page)
        {
            int pageSize = PAGE_SIZE;
            if (!page.HasValue)
                page = 1;

            ViewData["List"] = await _repository.GetListAuthorSong(page.Value, pageSize);
            return View();
        }
    }
}