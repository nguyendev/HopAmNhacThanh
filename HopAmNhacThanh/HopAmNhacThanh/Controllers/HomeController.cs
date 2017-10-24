using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data.HomeRepository;
using System.Text;
using HopAmNhacThanh.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;

namespace HopAmNhacThanh.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHomeRepository _repostitory;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public HomeController(IHomeRepository repository,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            _repostitory = repository;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        public async Task<IActionResult> Index()
        {
            if (!_signInManager.IsSignedIn(HttpContext.User))
            {
                string path = HttpContext.Request.Path.ToString();
                HttpContext.Session.SetString("currentUrl", path);
            }
            ViewData["MainContent"] = await _repostitory.GetMainHome();
            return View();
        }

        [Route("theo-chu-cai/{slug}")]
        public async Task<IActionResult> Alphabet(string slug, int? page)
        {
            ViewData["MainContent"] = await _repostitory.GetMainHome();
            int pageSize = 10;
            if (!page.HasValue)
                page = 1;
            char text = slug.First();
            ViewData["MainContent"] = await _repostitory.GetMainHome(text, page.Value, pageSize);
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
        [Route("bai-hat/{slug}/{slugVersion}")]
        public async Task<IActionResult> Single(string slug, string slugVersion)
        {
            if (!_signInManager.IsSignedIn(HttpContext.User))
            {
                string path = HttpContext.Request.Path.ToString();
                HttpContext.Session.SetString("currentUrl", path);
            }
            await _repostitory.IncreaseView(slug);
            ViewData["MainSingle"] = await _repostitory.GetMainSingle(slug,slugVersion);
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
        [Route("/tim-kiem")]
        public async Task<IActionResult> Search(
    string search,
    int? page)
        {
            int pageSize = 10;
            if (!page.HasValue)
                page = 1;

            ViewData["Search"] = await _repostitory.GetSearch(search, page.Value, pageSize);
            return View();
        }

        [Route("robots.txt", Name = "GetRobotsText")]
        public ContentResult RobotsText()
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.AppendLine("User-agent: *");
            stringBuilder.AppendLine("Disallow: /quan-ly-web/");
            stringBuilder.AppendLine("Disallow: /WebManager/");
            stringBuilder.AppendLine("Disallow: /wwwroot");
            stringBuilder.AppendLine("User-agent: Googlebot-Image");
            stringBuilder.AppendLine("Allow: /wwwroot/images");
            return this.Content(stringBuilder.ToString(), "text/plain", Encoding.UTF8);
        }

        private Task<ApplicationUser> GetCurrentUserAsync()
        {
            return _userManager.GetUserAsync(HttpContext.User);
        }
    }
}
