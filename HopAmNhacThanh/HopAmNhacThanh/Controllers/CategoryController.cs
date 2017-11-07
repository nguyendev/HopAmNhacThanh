using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.CategoryRepository;
using HopAmNhacThanh.Data.SidebarRepository;

namespace HopAmNhacThanh.Controllers
{
    public class CategoryController : Controller
    {
        private const int PAGE_SIZE = 20;
        private readonly ICategoryRepository _repository;
        private readonly ISidebarRepository _sidebarRepository;

        public CategoryController(ICategoryRepository repository,
            ISidebarRepository sidebarRepository)
        {
            _repository = repository;
            _sidebarRepository = sidebarRepository;
        }

        [Route("danh-muc/{slug}")]
        public async Task<IActionResult> Single(string slug, int? page)
        {
            if (!page.HasValue)
                page = 1;
            ViewData["Single"] = await _repository.GetSingleCategory(slug, page.Value, PAGE_SIZE);
            ViewData["Sidebar"] = await _sidebarRepository.GetCommonSidebar();
            return View();
        }

        [Route("danh-muc")]
        public async Task<IActionResult> List(
    int? page)
        {
            int pageSize = PAGE_SIZE;
            if (!page.HasValue)
                page = 1;

            ViewData["List"] = await _repository.GetListCategory(page.Value, pageSize);
            ViewData["Sidebar"] = await _sidebarRepository.GetCommonSidebar();
            return View();
        }
    }
}