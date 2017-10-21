using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Models.HomeViewModels;
using HopAmNhacThanh.Data.SongRepository;
using Microsoft.AspNetCore.Identity;
using HopAmNhacThanh.Models;

namespace HopAmNhacThanh.Controllers
{
    public class SongController : Controller
    {
        private readonly ISongRepository _repository;
        private readonly UserManager<ApplicationUser> _userManager;

        public SongController(ISongRepository repository,
            UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> AddNewVersionSong(AddNewVersionSong model)
        {
            var user = await GetCurrentUserAsync();
            await _repository.AddNewVersionSong(model, user);
            return LocalRedirect(model.Url);
        }

        [HttpPost]
        public async Task<IActionResult> ReportSong(ReportSongViewModel model)
        {
            await _repository.ReportSong(model);
            return LocalRedirect(model.Url);
        }

        private Task<ApplicationUser> GetCurrentUserAsync()
        {
            return _userManager.GetUserAsync(HttpContext.User);
        }
    }
}