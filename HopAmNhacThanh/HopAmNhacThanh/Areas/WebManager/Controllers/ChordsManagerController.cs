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
    public class ChordsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ChordsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/Chords
        [Route("quan-ly-web/hop-am")]
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Chords.Include(c => c.Author).Include(c => c.Song).Include(c => c.Style);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/Chords/Details/5
        [Route("quan-ly-web/hop-am/chi-tiet/{id}")]
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _context.Chords
                .Include(c => c.Author)
                .Include(c => c.Song)
                .Include(c => c.Style)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (chords == null)
            {
                return NotFound();
            }

            return View(chords);
        }

        // GET: WebManager/Chords/Create
        [Route("quan-ly-web/hop-am/tao-moi")]
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id");
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name");
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name");
            return View();
        }

        // POST: WebManager/Chords/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Route("quan-ly-web/hop-am/tao-moi")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,Version,Slug,InfoShort,Info,StyleID,Tone,Lyric,Intro,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] Chords chords)
        {
            if (ModelState.IsValid)
            {
                _context.Add(chords);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", chords.AuthorID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", chords.SongID);
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name", chords.StyleID);
            return View(chords);
        }

        // GET: WebManager/Chords/Edit/5
        [Route("quan-ly-web/hop-am/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _context.Chords.SingleOrDefaultAsync(m => m.ID == id);
            if (chords == null)
            {
                return NotFound();
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", chords.AuthorID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", chords.SongID);
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name", chords.StyleID);
            return View(chords);
        }

        // POST: WebManager/Chords/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("quan-ly-web/hop-am/chinh-sua/{id}")]
        public async Task<IActionResult> Edit(long id, [Bind("ID,SongID,Version,Slug,InfoShort,Info,StyleID,Tone,Lyric,Intro,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] Chords chords)
        {
            if (id != chords.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(chords);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ChordsExists(chords.ID))
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
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", chords.AuthorID);
            ViewData["SongID"] = new SelectList(_context.Song, "ID", "Name", chords.SongID);
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name", chords.StyleID);
            return View(chords);
        }

        // GET: WebManager/Chords/Delete/5
        [Route("quan-ly-web/hop-am/xoa/{id}")]
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _context.Chords
                .Include(c => c.Author)
                .Include(c => c.Song)
                .Include(c => c.Style)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (chords == null)
            {
                return NotFound();
            }

            return View(chords);
        }

        // POST: WebManager/Chords/Delete/5
        [HttpPost, ActionName("Delete")]
        [Route("quan-ly-web/hop-am/xoa/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var chords = await _context.Chords.SingleOrDefaultAsync(m => m.ID == id);
            _context.Chords.Remove(chords);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ChordsExists(long id)
        {
            return _context.Chords.Any(e => e.ID == id);
        }
    }
}
