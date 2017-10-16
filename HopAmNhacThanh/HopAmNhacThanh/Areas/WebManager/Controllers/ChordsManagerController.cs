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
    public class ChordsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ChordsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/ChordsManager
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Chords.Include(c => c.Author).Include(c => c.Style);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/ChordsManager/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _context.Chords
                .Include(c => c.Author)
                .Include(c => c.Style)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (chords == null)
            {
                return NotFound();
            }

            return View(chords);
        }

        // GET: WebManager/ChordsManager/Create
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id");
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name");
            return View();
        }

        // POST: WebManager/ChordsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,Version,Slug,InfoShort,Info,StyleID,Tone,Lyric,Intro,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] Chords chords)
        {
            if (ModelState.IsValid)
            {
                _context.Add(chords);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id", chords.AuthorID);
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name", chords.StyleID);
            return View(chords);
        }

        // GET: WebManager/ChordsManager/Edit/5
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
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id", chords.AuthorID);
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name", chords.StyleID);
            return View(chords);
        }

        // POST: WebManager/ChordsManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
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
            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "Id", chords.AuthorID);
            ViewData["StyleID"] = new SelectList(_context.Style, "ID", "Name", chords.StyleID);
            return View(chords);
        }

        // GET: WebManager/ChordsManager/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var chords = await _context.Chords
                .Include(c => c.Author)
                .Include(c => c.Style)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (chords == null)
            {
                return NotFound();
            }

            return View(chords);
        }

        // POST: WebManager/ChordsManager/Delete/5
        [HttpPost, ActionName("Delete")]
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
