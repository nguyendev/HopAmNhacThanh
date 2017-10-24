using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using Microsoft.AspNetCore.Authorization;
using HopAmNhacThanh.Areas.WebManager.Data;
using HopAmNhacThanh.Areas.WebManager.ViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.AlbumViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;
using Microsoft.AspNetCore.Identity;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class AlbumsManagerController : Controller
    {
        private readonly IAlbumManagerRepository _repository;
        private readonly UserManager<ApplicationUser> _userManager;

        public AlbumsManagerController(IAlbumManagerRepository repository,
            UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _userManager = userManager;
        }

        [Route("/quan-ly-web/album")]
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
            ViewData["TitleParm"] = String.IsNullOrEmpty(sortOrder) ? "title" : "";
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

        [Route("/quan-ly-web/album/chi-tiet/{id}")]
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var single = await _repository.Details(id);
            if (single == null)
            {
                return NotFound();
            }

            return View(single);
        }

        // GET: WebManager/SongManager/Create
       
        [Route("quan-ly-web/album/tao-moi")]
        public IActionResult Create()
        {
            return View();
        }

        // POST: WebManager/SongsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("quan-ly-web/album/tao-moi")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateAlbumViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await GetCurrentUser();
                bool result = await _repository.Create(model, user);
                if (result)
                    return RedirectToAction("Index");
                return NotFound();
            }
            return View(model);
        }



        // GET: WebManager/SongManager/Edit/5
        [Route("/quan-ly-web/album/chinh-sua/{id}")]
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
            return View(song);
        }

        // POST: WebManager/SongManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("/quan-ly-web/album/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long id, EditAlbumViewModel model)
        {
            if (id != model.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.Update(model);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SongExists(model.ID))
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
            return View(model);
        }

        // GET: WebManager/SongManager/Delete/5
        [Route("/quan-ly-web/album/xoa/{id}")]
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
        [Route("/quan-ly-web/album/xoa/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            await _repository.Delete(id);
            return RedirectToAction("Index");
        }

        [Route("/quan-ly-web/album/chinh-sua-xuat-ban/{id}")]
        public async Task<IActionResult> EditPublishDT(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditPublishDT(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/album/chinh-sua-xuat-ban/{id}")]
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

        [Route("/quan-ly-web/album/chinh-sua-duyet/{id}")]
        public async Task<IActionResult> EditApproved(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditApproved(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/album/chinh-sua-duyet/{id}")]
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
