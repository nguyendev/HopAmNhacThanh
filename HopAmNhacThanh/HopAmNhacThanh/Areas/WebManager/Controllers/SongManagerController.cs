using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models;

namespace HopAmNhacThanh.Areas.WebManager.Controllers
{
    [Area("WebManager")]
    public class SongManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SongManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/SongManager
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Song.Include(s => s.Author).Include(s => s.AuthorSong).Include(s => s.Category);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/SongManager/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _context.Song
                .Include(s => s.Author)
                .Include(s => s.AuthorSong)
                .Include(s => s.Category)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (song == null)
            {
                return NotFound();
            }

            return View(song);
        }

        // GET: WebManager/SongManager/Create
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id");
            ViewData["AuthorSongID"] = new SelectList(_context.Set<AuthorSong>(), "ID", "ID");
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name");
            return View();
        }

        // POST: WebManager/SongManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Name,OrtherName,CategoryID,AuthorSongID,VietnameseLyric,YearPublish,Views,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] Song song)
        {
            if (ModelState.IsValid)
            {
                _context.Add(song);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id", song.AuthorID);
            ViewData["AuthorSongID"] = new SelectList(_context.Set<AuthorSong>(), "ID", "ID", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            return View(song);
        }

        // GET: WebManager/SongManager/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _context.Song.SingleOrDefaultAsync(m => m.ID == id);
            if (song == null)
            {
                return NotFound();
            }
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id", song.AuthorID);
            ViewData["AuthorSongID"] = new SelectList(_context.Set<AuthorSong>(), "ID", "ID", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            return View(song);
        }

        // POST: WebManager/SongManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,Name,OrtherName,CategoryID,AuthorSongID,VietnameseLyric,YearPublish,Views,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] Song song)
        {
            if (id != song.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(song);
                    await _context.SaveChangesAsync();
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
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id", song.AuthorID);
            ViewData["AuthorSongID"] = new SelectList(_context.Set<AuthorSong>(), "ID", "ID", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            return View(song);
        }

        // GET: WebManager/SongManager/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _context.Song
                .Include(s => s.Author)
                .Include(s => s.AuthorSong)
                .Include(s => s.Category)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (song == null)
            {
                return NotFound();
            }

            return View(song);
        }

        // POST: WebManager/SongManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var song = await _context.Song.SingleOrDefaultAsync(m => m.ID == id);
            _context.Song.Remove(song);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool SongExists(long id)
        {
            return _context.Song.Any(e => e.ID == id);
        }
    }
}
