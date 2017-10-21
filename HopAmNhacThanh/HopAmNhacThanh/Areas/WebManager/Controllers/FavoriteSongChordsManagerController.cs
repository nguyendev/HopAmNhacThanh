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
    public class FavoriteSongChordsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public FavoriteSongChordsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/FavoriteSongChords
        public async Task<IActionResult> Index()
        {
            return View(await _context.FavoriteSongChord.ToListAsync());
        }

        // GET: WebManager/FavoriteSongChords/Details/5
        public async Task<IActionResult> Details(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var favoriteSongChord = await _context.FavoriteSongChord
                .SingleOrDefaultAsync(m => m.ID == id);
            if (favoriteSongChord == null)
            {
                return NotFound();
            }

            return View(favoriteSongChord);
        }

        // GET: WebManager/FavoriteSongChords/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: WebManager/FavoriteSongChords/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,SongID,ChordID")] FavoriteSongChord favoriteSongChord)
        {
            if (ModelState.IsValid)
            {
                _context.Add(favoriteSongChord);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(favoriteSongChord);
        }

        // GET: WebManager/FavoriteSongChords/Edit/5
        public async Task<IActionResult> Edit(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var favoriteSongChord = await _context.FavoriteSongChord.SingleOrDefaultAsync(m => m.ID == id);
            if (favoriteSongChord == null)
            {
                return NotFound();
            }
            return View(favoriteSongChord);
        }

        // POST: WebManager/FavoriteSongChords/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, [Bind("ID,SongID,ChordID")] FavoriteSongChord favoriteSongChord)
        {
            if (id != favoriteSongChord.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(favoriteSongChord);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!FavoriteSongChordExists(favoriteSongChord.ID))
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
            return View(favoriteSongChord);
        }

        // GET: WebManager/FavoriteSongChords/Delete/5
        public async Task<IActionResult> Delete(long? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var favoriteSongChord = await _context.FavoriteSongChord
                .SingleOrDefaultAsync(m => m.ID == id);
            if (favoriteSongChord == null)
            {
                return NotFound();
            }

            return View(favoriteSongChord);
        }

        // POST: WebManager/FavoriteSongChords/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(long id)
        {
            var favoriteSongChord = await _context.FavoriteSongChord.SingleOrDefaultAsync(m => m.ID == id);
            _context.FavoriteSongChord.Remove(favoriteSongChord);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool FavoriteSongChordExists(long id)
        {
            return _context.FavoriteSongChord.Any(e => e.ID == id);
        }
    }
}
