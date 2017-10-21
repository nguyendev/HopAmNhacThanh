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
    public class VietnameseLyricsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public VietnameseLyricsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/VietnameseLyricsManager
        public async Task<IActionResult> Index()
        {
            return View(await _context.VietnameseLyric.ToListAsync());
        }

        // GET: WebManager/VietnameseLyricsManager/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var vietnameseLyric = await _context.VietnameseLyric
                .SingleOrDefaultAsync(m => m.ID == id);
            if (vietnameseLyric == null)
            {
                return NotFound();
            }

            return View(vietnameseLyric);
        }

        // GET: WebManager/VietnameseLyricsManager/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: WebManager/VietnameseLyricsManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Name,Slug,Image,Content")] VietnameseLyric vietnameseLyric)
        {
            if (ModelState.IsValid)
            {
                _context.Add(vietnameseLyric);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(vietnameseLyric);
        }

        // GET: WebManager/VietnameseLyricsManager/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var vietnameseLyric = await _context.VietnameseLyric.SingleOrDefaultAsync(m => m.ID == id);
            if (vietnameseLyric == null)
            {
                return NotFound();
            }
            return View(vietnameseLyric);
        }

        // POST: WebManager/VietnameseLyricsManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Name,Slug,Image,Content")] VietnameseLyric vietnameseLyric)
        {
            if (id != vietnameseLyric.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(vietnameseLyric);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!VietnameseLyricExists(vietnameseLyric.ID))
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
            return View(vietnameseLyric);
        }

        // GET: WebManager/VietnameseLyricsManager/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var vietnameseLyric = await _context.VietnameseLyric
                .SingleOrDefaultAsync(m => m.ID == id);
            if (vietnameseLyric == null)
            {
                return NotFound();
            }

            return View(vietnameseLyric);
        }

        // POST: WebManager/VietnameseLyricsManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var vietnameseLyric = await _context.VietnameseLyric.SingleOrDefaultAsync(m => m.ID == id);
            _context.VietnameseLyric.Remove(vietnameseLyric);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool VietnameseLyricExists(int id)
        {
            return _context.VietnameseLyric.Any(e => e.ID == id);
        }
    }
}
