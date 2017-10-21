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

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    [Authorize(Roles = "Admin, Manager")]
    public class VideosManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VideosManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/VideosManager
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Video.Include(v => v.Song);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/VideosManager/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var video = await _context.Video
                .Include(v => v.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (video == null)
            {
                return NotFound();
            }

            return View(video);
        }

        // GET: WebManager/VideosManager/Create
        public IActionResult Create()
        {
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            return View();
        }

        // POST: WebManager/VideosManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,Name,Link,Type")] Video video)
        {
            if (ModelState.IsValid)
            {
                _context.Add(video);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", video.SongID);
            return View(video);
        }

        // GET: WebManager/VideosManager/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var video = await _context.Video.SingleOrDefaultAsync(m => m.ID == id);
            if (video == null)
            {
                return NotFound();
            }
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", video.SongID);
            return View(video);
        }

        // POST: WebManager/VideosManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,SongID,Name,Link,Type")] Video video)
        {
            if (id != video.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(video);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!VideoExists(video.ID))
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
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", video.SongID);
            return View(video);
        }

        // GET: WebManager/VideosManager/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var video = await _context.Video
                .Include(v => v.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (video == null)
            {
                return NotFound();
            }

            return View(video);
        }

        // POST: WebManager/VideosManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var video = await _context.Video.SingleOrDefaultAsync(m => m.ID == id);
            _context.Video.Remove(video);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool VideoExists(long id)
        {
            return _context.Video.Any(e => e.ID == id);
        }
    }
}
