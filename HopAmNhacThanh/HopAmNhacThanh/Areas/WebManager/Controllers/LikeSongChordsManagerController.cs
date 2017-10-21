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
    public class LikeSongChordsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public LikeSongChordsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/LikeSongChords
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.LikeSongChords.Include(l => l.Author);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/LikeSongChords/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var likeSongChords = await _context.LikeSongChords
                .Include(l => l.Author)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (likeSongChords == null)
            {
                return NotFound();
            }

            return View(likeSongChords);
        }

        // GET: WebManager/LikeSongChords/Create
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id");
            return View();
        }

        // POST: WebManager/LikeSongChords/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,ChordID,Like,UnLike,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] LikeSongChords likeSongChords)
        {
            if (ModelState.IsValid)
            {
                _context.Add(likeSongChords);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", likeSongChords.AuthorID);
            return View(likeSongChords);
        }

        // GET: WebManager/LikeSongChords/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var likeSongChords = await _context.LikeSongChords.SingleOrDefaultAsync(m => m.ID == id);
            if (likeSongChords == null)
            {
                return NotFound();
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", likeSongChords.AuthorID);
            return View(likeSongChords);
        }

        // POST: WebManager/LikeSongChords/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,SongID,ChordID,Like,UnLike,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] LikeSongChords likeSongChords)
        {
            if (id != likeSongChords.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(likeSongChords);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LikeSongChordsExists(likeSongChords.ID))
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
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", likeSongChords.AuthorID);
            return View(likeSongChords);
        }

        // GET: WebManager/LikeSongChords/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var likeSongChords = await _context.LikeSongChords
                .Include(l => l.Author)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (likeSongChords == null)
            {
                return NotFound();
            }

            return View(likeSongChords);
        }

        // POST: WebManager/LikeSongChords/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var likeSongChords = await _context.LikeSongChords.SingleOrDefaultAsync(m => m.ID == id);
            _context.LikeSongChords.Remove(likeSongChords);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool LikeSongChordsExists(long id)
        {
            return _context.LikeSongChords.Any(e => e.ID == id);
        }
    }
}
