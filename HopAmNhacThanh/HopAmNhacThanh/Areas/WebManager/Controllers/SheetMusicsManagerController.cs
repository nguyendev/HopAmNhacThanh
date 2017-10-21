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
    public class SheetMusicsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public SheetMusicsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/SheetMusicsManager
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.SheetMusic.Include(s => s.Author).Include(s => s.Song);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/SheetMusicsManager/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sheetMusic = await _context.SheetMusic
                .Include(s => s.Author)
                .Include(s => s.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (sheetMusic == null)
            {
                return NotFound();
            }

            return View(sheetMusic);
        }

        // GET: WebManager/SheetMusicsManager/Create
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id");
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            return View();
        }

        // POST: WebManager/SheetMusicsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,Name,Type,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] SheetMusic sheetMusic)
        {
            if (ModelState.IsValid)
            {
                _context.Add(sheetMusic);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", sheetMusic.AuthorID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", sheetMusic.SongID);
            return View(sheetMusic);
        }

        // GET: WebManager/SheetMusicsManager/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sheetMusic = await _context.SheetMusic.SingleOrDefaultAsync(m => m.ID == id);
            if (sheetMusic == null)
            {
                return NotFound();
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", sheetMusic.AuthorID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", sheetMusic.SongID);
            return View(sheetMusic);
        }

        // POST: WebManager/SheetMusicsManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,SongID,Name,Type,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] SheetMusic sheetMusic)
        {
            if (id != sheetMusic.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(sheetMusic);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SheetMusicExists(sheetMusic.ID))
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
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", sheetMusic.AuthorID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", sheetMusic.SongID);
            return View(sheetMusic);
        }

        // GET: WebManager/SheetMusicsManager/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sheetMusic = await _context.SheetMusic
                .Include(s => s.Author)
                .Include(s => s.Song)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (sheetMusic == null)
            {
                return NotFound();
            }

            return View(sheetMusic);
        }

        // POST: WebManager/SheetMusicsManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var sheetMusic = await _context.SheetMusic.SingleOrDefaultAsync(m => m.ID == id);
            _context.SheetMusic.Remove(sheetMusic);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool SheetMusicExists(long id)
        {
            return _context.SheetMusic.Any(e => e.ID == id);
        }
    }
}
