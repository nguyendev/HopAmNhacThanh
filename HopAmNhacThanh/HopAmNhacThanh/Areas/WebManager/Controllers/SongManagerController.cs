using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Areas.WebManager.ViewModels;
using HopAmNhacThanh.Areas.WebManager.Data;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SongViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class SongManagerController : Controller
    {
        private readonly ISongManagerRepository _repository;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public SongManagerController(ISongManagerRepository repository,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _repository = repository;
            _context = context;
        }

        // GET: WebManager/SongManager
        [Route("/quan-ly-web/bai-hat")]
        public async Task<IActionResult> Index(string sortOrder,
 string currentFilter,
    string searchString,
    int? page, int? pageSize)
        {
            List<NumberItem> SoLuong = new List<NumberItem>
            {
                new NumberItem { Value = 10},
                new NumberItem { Value = 20},
                new NumberItem { Value = 50},
                new NumberItem { Value = 100},
            };
            ViewData["SoLuong"] = SoLuong;
            ViewData["CurrentSort"] = sortOrder;
            ViewData["NameParm"] = String.IsNullOrEmpty(sortOrder) ? "name" : "";
            ViewData["CategoryParm"] = String.IsNullOrEmpty(sortOrder) ? "category" : "";
            ViewData["AlbumParm"] = String.IsNullOrEmpty(sortOrder) ? "album" : "";
            ViewData["ApprovedParm"] = String.IsNullOrEmpty(sortOrder) ? "approved" : "";
            ViewData["CreateDTParm"] = String.IsNullOrEmpty(sortOrder) ? "createDT" : "";
            ViewData["ViewsParm"] = String.IsNullOrEmpty(sortOrder) ? "views" : "";
            ViewData["CurrentSize"] = pageSize;
            if (searchString != null)
            {
                page = 1;
            }
            else
            {
                searchString = currentFilter;
            }

            ViewData["CurrentFilter"] = searchString;
            var applicationDbContext = await _repository.GetAll(sortOrder, searchString, page, pageSize);
            return View(applicationDbContext);
        }

        // GET: WebManager/SongManager/Details/5
        [Route("/quan-ly-web/bai-hat/chi-tiet/{id}")]
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _repository.Details(id);
            if (song == null)
            {
                return NotFound();
            }

            return View(song);
        }

        // GET: WebManager/SongManager/Create
        [Route("quan-ly-web/bai-hat/tao-moi-day-du")]
        public IActionResult CreateFull()
        {
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id");
            ViewData["AuthorSongID"] = new SelectList(_context.Set<AuthorSong>(), "ID", "Name");
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name");
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> SaveAll(CreateSongFullViewModels CreateSongViewModels)
        {
            //if (login fails)
            //{
            //return Json(new { result = "InvalidLogin" }, JsonRequestBehavior.AllowGet);
            var user = await GetCurrentUser();
            bool result = await _repository.CreateFull(CreateSongViewModels, user);
            if(result)
                return Json(new { success = true, url = Url.Action("Index") });
            ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists, see your system administrator.");
            return Json(new { success = false, url = Url.Action("Index") });
        }
        [Route("quan-ly-web/bai-hat/tao-moi")]
        public IActionResult Create()
        {
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "Name");
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "Name");
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name");
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "Name");
            return View();
        }

        // POST: WebManager/SongsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("quan-ly-web/bai-hat/tao-moi")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateSongViewModel song)
        {
            if (ModelState.IsValid)
            {
                var user = await GetCurrentUser();
                bool result = await _repository.Create(song, user);
                if(result)
                    return RedirectToAction("Index");
                return NotFound();
            }
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "Name", song.AlbumID);
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "Name", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "Name", song.VietnameseLyricID);
            return View(song);
        }



        // GET: WebManager/SongManager/Edit/5
        [Route("/quan-ly-web/bai-hat/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _repository.GetEdit(id);
            if (song == null)
            {
                return NotFound();
            }
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "Name", song.AlbumID);
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "Name", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "Name", song.VietnameseLyricID);
            return View(song);
        }

        // POST: WebManager/SongManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("/quan-ly-web/bai-hat/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long id, EditSongViewModels song)
        {
            if (id != song.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.Update(song);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SongExists(song.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "Name", song.AlbumID);
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "Name", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "Name", song.VietnameseLyricID);
            return View(song);
        }

        // GET: WebManager/SongManager/Delete/5
        [Route("/quan-ly-web/bai-hat/xoa/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _repository.Get(id);
            if (song == null)
            {
                return NotFound();
            }

            return View(song);
        }

        // POST: WebManager/SongManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [Route("/quan-ly-web/bai-hat/xoa/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            await _repository.Delete(id);
            return RedirectToAction("Index");
        }

        [Route("/quan-ly-web/bai-hat/chinh-sua-xuat-ban/{id}")]
        public async Task<IActionResult> EditPublishDT(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditPublishDT(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/bai-hat/chinh-sua-xuat-ban/{id}")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditPublishDT(PublishDTViewModels model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.UpdatePublishDT(model);
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound();
                }
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [Route("/quan-ly-web/bai-hat/chinh-sua-duyet/{id}")]
        public async Task<IActionResult> EditApproved(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditApproved(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/bai-hat/chinh-sua-duyet/{id}")]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditApproved(ApprovedViewModels model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.UpdateApproved(model);
                }
                catch (DbUpdateConcurrencyException)
                {
                    return NotFound();
                }
                return RedirectToAction("Index");
            }
            return View(model);
        }

        private bool SongExists(long id)
        {
            return _repository.Exists(id);
        }
        private async Task<ApplicationUser> GetCurrentUser()
        {
            return await _userManager.GetUserAsync(HttpContext.User);
        }
    }
}
