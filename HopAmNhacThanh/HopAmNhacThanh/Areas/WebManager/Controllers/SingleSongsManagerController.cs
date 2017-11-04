using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;
using HopAmNhacThanh.Areas.WebManager.Data;
using Microsoft.AspNetCore.Identity;
using HopAmNhacThanh.Areas.WebManager.ViewModels;
using Microsoft.AspNetCore.Authorization;
using HopAmNhacThanh.Areas.WebManager.ViewModels.SingleSongViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class SingleSongsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ISingleSongManagerRepository _repository;
        private readonly UserManager<ApplicationUser> _userManager;

        public SingleSongsManagerController(ApplicationDbContext context,
            ISingleSongManagerRepository repository,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _repository = repository;
            _userManager = userManager;
        }

        // GET: WebManager/Chords
        [Route("quan-ly-web/ca-sy")]
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

        // GET: WebManager/Chords/Details/5
        [Route("quan-ly-web/ca-sy/chi-tiet/{id}")]
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _repository.Details(id);
            if (chords == null)
            {
                return NotFound();
            }

            return View(chords);
        }

        // GET: WebManager/Chords/Create
        [Route("quan-ly-web/ca-sy/tao-moi")]
        public IActionResult Create()
        {
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name");
            return View();
        }

        // POST: WebManager/Chords/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("quan-ly-web/ca-sy/tao-moi")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateSingleSongViewModel singleSong)
        {
            if (ModelState.IsValid)
            {
                var user = await GetCurrentUser();
                bool result = await _repository.Create(singleSong, user);
                if (result)
                    return RedirectToAction("Index");
                return NotFound();
            }
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", singleSong.ImageID);
            return View(singleSong);
        }

        // GET: WebManager/Chords/Edit/5
        [Route("quan-ly-web/ca-sy/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var singleSong = await _repository.GetEdit(id);
            if (singleSong == null)
            {
                return NotFound();
            }
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", singleSong.ImageID);
            return View(singleSong);
        }

        // POST: WebManager/Chords/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("quan-ly-web/ca-sy/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long id, EditSingleSongViewModel singleSong)
        {
            if (id != singleSong.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.Update(singleSong);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ChordsExists(singleSong.ID))
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
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", singleSong.ImageID);
            return View(singleSong);
        }

        // GET: WebManager/Chords/Delete/5
        [Route("quan-ly-web/ca-sy/xoa/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _repository.Get(id);
            if (chords == null)
            {
                return NotFound();
            }

            return View(chords);
        }

        // POST: WebManager/Chords/Delete/5
        [HttpPost, ActionName("Delete")]
        [Route("quan-ly-web/ca-sy/xoa/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            await _repository.Delete(id);
            return RedirectToAction("Index");
        }

        private bool ChordsExists(long id)
        {
            return _repository.Exists(id);
        }
        private async Task<ApplicationUser> GetCurrentUser()
        {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        [Route("/quan-ly-web/ca-sy/chinh-sua-xuat-ban/{id}")]
        public async Task<IActionResult> EditPublishDT(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditPublishDT(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/ca-sy/chinh-sua-xuat-ban/{id}")]
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

        [Route("/quan-ly-web/ca-sy/chinh-sua-duyet/{id}")]
        public async Task<IActionResult> EditApproved(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditApproved(id);
            return View(singlePuzzle);
        }

        [Route("/quan-ly-web/ca-sy/chinh-sua-duyet/{id}")]
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

    }
}
