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

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class VideosManagerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IVideoManagerRepository _repository;
        public VideosManagerController(IVideoManagerRepository repository,
            ApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        // GET: WebManager/Chords
        [Route("quan-ly-web/video")]
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
        [Route("quan-ly-web/video/chi-tiet/{id}")]
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
        [Route("quan-ly-web/video/tao-moi")]
        public IActionResult Create()
        {
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name");
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            return View();
        }

        // POST: WebManager/Chords/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("quan-ly-web/video/tao-moi")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Video model)
        {
            if (ModelState.IsValid)
            {
                bool result = await _repository.Create(model);
                if (result)
                    return RedirectToAction("Index");
                return NotFound();
            }
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", model.ImageID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", model.SongID);
            return View(model);
        }

        // GET: WebManager/Chords/Edit/5
        [Route("quan-ly-web/video/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var model = await _repository.GetEdit(id);
            if (model == null)
            {
                return NotFound();
            }
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", model.ImageID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", model.SongID);
            return View(model);
        }

        // POST: WebManager/Chords/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("quan-ly-web/video/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long id, Video model)
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
                    if (!VideoExists(model.ID))
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
            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", model.ImageID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", model.SongID);
            return View(model);
        }

        // GET: WebManager/Chords/Delete/5
        [Route("quan-ly-web/video/xoa/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var model = await _repository.Get(id);
            if (model == null)
            {
                return NotFound();
            }

            return View(model);
        }

        // POST: WebManager/Chords/Delete/5
        [HttpPost, ActionName("Delete")]
        [Route("quan-ly-web/video/xoa/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            await _repository.Delete(id);
            return RedirectToAction("Index");
        }

        private bool VideoExists(long id)
        {
            return _repository.Exists(id);
        }
    }
}
