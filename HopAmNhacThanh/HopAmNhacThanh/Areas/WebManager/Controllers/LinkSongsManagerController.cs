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
    public class LinkSongsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LinkSongsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/LinkSongs
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.LinkSong.Include(l => l.Author).Include(l => l.SingleSong).Include(l => l.Song);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/LinkSongs/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var linkSong = await _context.LinkSong
                .Include(l => l.Author)
                .Include(l => l.SingleSong)
                .Include(l => l.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (linkSong == null)
            {
                return NotFound();
            }

            return View(linkSong);
        }

        // GET: WebManager/LinkSongs/Create
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id");
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name");
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            return View();
        }

        // POST: WebManager/LinkSongs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,Tone,Link,SingleSongID,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] LinkSong linkSong)
        {
            if (ModelState.IsValid)
            {
                _context.Add(linkSong);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", linkSong.AuthorID);
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name", linkSong.SingleSongID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", linkSong.SongID);
            return View(linkSong);
        }

        // GET: WebManager/LinkSongs/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var linkSong = await _context.LinkSong.SingleOrDefaultAsync(m => m.ID == id);
            if (linkSong == null)
            {
                return NotFound();
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", linkSong.AuthorID);
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name", linkSong.SingleSongID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", linkSong.SongID);
            return View(linkSong);
        }

        // POST: WebManager/LinkSongs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,SongID,Tone,Link,SingleSongID,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] LinkSong linkSong)
        {
            if (id != linkSong.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(linkSong);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LinkSongExists(linkSong.ID))
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
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", linkSong.AuthorID);
            ViewData["SingleSongID"] = new SelectList(_context.SingleSong, "ID", "Name", linkSong.SingleSongID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", linkSong.SongID);
            return View(linkSong);
        }

        // GET: WebManager/LinkSongs/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var linkSong = await _context.LinkSong
                .Include(l => l.Author)
                .Include(l => l.SingleSong)
                .Include(l => l.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (linkSong == null)
            {
                return NotFound();
            }

            return View(linkSong);
        }

        // POST: WebManager/LinkSongs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var linkSong = await _context.LinkSong.SingleOrDefaultAsync(m => m.ID == id);
            _context.LinkSong.Remove(linkSong);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool LinkSongExists(long id)
        {
            return _context.LinkSong.Any(e => e.ID == id);
        }
    }
}
