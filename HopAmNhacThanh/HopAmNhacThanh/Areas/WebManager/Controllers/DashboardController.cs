using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using HopAmNhacThanh.Areas.WebManager.Data;

namespace HopAmNhacThanh.Areas.Admin.Controllers
{
    [Area("webmanager")]
    //[Authorize(Roles = "Admin, Manager")]
    public class DashboardController : Controller
    {
        private readonly IDashboardRepository _repository;
        public DashboardController(IDashboardRepository repository)
        {
            this._repository = repository;
        }
        [Route("/quan-ly-web/")]
        public async Task<IActionResult> Index()
        {
            var model = await _repository.GetIndex();
            return View(model);
        }
    }
}
