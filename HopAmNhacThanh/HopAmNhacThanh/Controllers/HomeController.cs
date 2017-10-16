using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.HomeRepository;

namespace HopAmNhacThanh.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHomeRepository _repostitory;
        public HomeController(IHomeRepository repository)
        {
            _repostitory = repository;
        }
        public async Task<IActionResult> Index()
        {
            ViewData["MainContent"] = await _repostitory.GetMainContent();
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }



        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }
        public IActionResult Single()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }
        public IActionResult SingleWithFullScreen()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }
        public IActionResult UnFinished()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        public IActionResult Single2()
        {
            return View();
        }
    }
}
