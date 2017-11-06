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
using HopAmNhacThanh.Areas.WebManager.ViewModels;
using HopAmNhacThanh.Areas.WebManager.ViewModels.AuthorSongViewModels;
using Microsoft.AspNetCore.Identity;
using HopAmNhacThanh.Areas.WebManager.ViewModels.CommonViewModels;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    public class AuthorSongsManagerController : Controller
    {
        private readonly IAuthorSongsManagerRepository _repository;
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private const string ROOT_SLUG = "quan-ly-web/tac-gia-bai-hat/";
        public AuthorSongsManagerController(IAuthorSongsManagerRepository repository,
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _repository = repository;
            _context = context;
            _userManager = userManager;
        }

        // GET: WebManager/Chords
        [Route(ROOT_SLUG)]
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
        [Route(ROOT_SLUG + "chi-tiet/{id}")]
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
        [Route(ROOT_SLUG + "tao-moi")]
        public IActionResult Create()
        {
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name");
            return View();
        }

        // POST: WebManager/Chords/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route(ROOT_SLUG + "tao-moi")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateAuthorSongViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await GetCurrentUser();
                bool result = await _repository.Create(model, user);
                if (result)
                    return RedirectToAction("Index");
                return NotFound();
            }
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", model.ImageID);
            return View(model);
        }

        // GET: WebManager/Chords/Edit/5
        [Route(ROOT_SLUG + "chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var single = await _repository.GetEdit(id);
            if (single == null)
            {
                return NotFound();
            }
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", single.ImageID);
            return View(single);
        }

        // POST: WebManager/Chords/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route(ROOT_SLUG + "chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long id, EditAuthorSongViewModel style)
        {
            if (id != style.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    await _repository.Update(style);
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StyleExists(style.ID))
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
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", style.ImageID);
            return View(style);
        }

        // GET: WebManager/Chords/Delete/5
        [Route(ROOT_SLUG + "xoa/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var category = await _repository.Get(id);
            if (category == null)
            {
                return NotFound();
            }

            return View(category);
        }

        // POST: WebManager/Chords/Delete/5
        [HttpPost, ActionName("Delete")]
        [Route(ROOT_SLUG + "xoa/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            await _repository.Delete(id);
            return RedirectToAction("Index");
        }

        private bool StyleExists(long id)
        {
            return _repository.Exists(id);
        }
        private async Task<ApplicationUser> GetCurrentUser()
        {
            return await _userManager.GetUserAsync(HttpContext.User);
        }

        [Route(ROOT_SLUG + "chinh-sua-xuat-ban/{id}")]
        public async Task<IActionResult> EditPublishDT(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditPublishDT(id);
            return View(singlePuzzle);
        }

        [Route(ROOT_SLUG + "chinh-sua-xuat-ban/{id}")]
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

        [Route(ROOT_SLUG + "chinh-sua-duyet/{id}")]
        public async Task<IActionResult> EditApproved(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }
            var singlePuzzle = await _repository.GetEditApproved(id);
            return View(singlePuzzle);
        }

        [Route(ROOT_SLUG +"chinh-sua-duyet/{id}")]
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

