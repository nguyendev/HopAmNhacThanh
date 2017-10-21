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
    public class SongsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SongsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/SongsManager
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Song.Include(s => s.Album).Include(s => s.Author).Include(s => s.AuthorSong).Include(s => s.Category).Include(s => s.VietnameseLyric);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/SongsManager/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _context.Song
                .Include(s => s.Album)
                .Include(s => s.Author)
                .Include(s => s.AuthorSong)
                .Include(s => s.Category)
                .Include(s => s.VietnameseLyric)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (song == null)
            {
                return NotFound();
            }

            return View(song);
        }

        // GET: WebManager/SongsManager/Create
        public IActionResult Create()
        {
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "ID");
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id");
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "ID");
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name");
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "ID");
            return View();
        }

        // POST: WebManager/SongsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Name,OrtherName,Slug,CategoryID,AlbumID,NumberSongInAlbum,AuthorSongID,VietnameseLyricID,YearPublish,Views,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] Song song)
        {
            if (ModelState.IsValid)
            {
                _context.Add(song);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "ID", song.AlbumID);
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", song.AuthorID);
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "ID", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "ID", song.VietnameseLyricID);
            return View(song);
        }

        // GET: WebManager/SongsManager/Edit/5
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
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "ID", song.AlbumID);
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", song.AuthorID);
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "ID", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "ID", song.VietnameseLyricID);
            return View(song);
        }

        // POST: WebManager/SongsManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,Name,OrtherName,Slug,CategoryID,AlbumID,NumberSongInAlbum,AuthorSongID,VietnameseLyricID,YearPublish,Views,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] Song song)
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
            ViewData["AlbumID"] = new SelectList(_context.Album, "ID", "ID", song.AlbumID);
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", song.AuthorID);
            ViewData["AuthorSongID"] = new SelectList(_context.AuthorSong, "ID", "ID", song.AuthorSongID);
            ViewData["CategoryID"] = new SelectList(_context.Category, "ID", "Name", song.CategoryID);
            ViewData["VietnameseLyricID"] = new SelectList(_context.VietnameseLyric, "ID", "ID", song.VietnameseLyricID);
            return View(song);
        }

        // GET: WebManager/SongsManager/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var song = await _context.Song
                .Include(s => s.Album)
                .Include(s => s.Author)
                .Include(s => s.AuthorSong)
                .Include(s => s.Category)
                .Include(s => s.VietnameseLyric)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (song == null)
            {
                return NotFound();
            }

            return View(song);
        }

        // POST: WebManager/SongsManager/Delete/5
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
