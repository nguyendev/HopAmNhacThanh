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
    public class AuthorSongsManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AuthorSongsManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/AuthorSongs
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.AuthorSong.Include(a => a.Author);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: WebManager/AuthorSongs/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var authorSong = await _context.AuthorSong
                .Include(a => a.Author)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (authorSong == null)
            {
                return NotFound();
            }

            return View(authorSong);
        }

        // GET: WebManager/AuthorSongs/Create
        public IActionResult Create()
        {
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id");
            return View();
        }

        // POST: WebManager/AuthorSongs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Name,Image,Slug,Content,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] AuthorSong authorSong)
        {
            if (ModelState.IsValid)
            {
                _context.Add(authorSong);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", authorSong.AuthorID);
            return View(authorSong);
        }

        // GET: WebManager/AuthorSongs/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var authorSong = await _context.AuthorSong.SingleOrDefaultAsync(m => m.ID == id);
            if (authorSong == null)
            {
                return NotFound();
            }
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", authorSong.AuthorID);
            return View(authorSong);
        }

        // POST: WebManager/AuthorSongs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Name,Image,Slug,Content,CreateDT,UpdateDT,AuthorID,Approved,Active,IsDeleted,Note")] AuthorSong authorSong)
        {
            if (id != authorSong.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(authorSong);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AuthorSongExists(authorSong.ID))
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
            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "Id", authorSong.AuthorID);
            return View(authorSong);
        }

        // GET: WebManager/AuthorSongs/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var authorSong = await _context.AuthorSong
                .Include(a => a.Author)
                .SingleOrDefaultAsync(m => m.ID == id);
            if (authorSong == null)
            {
                return NotFound();
            }

            return View(authorSong);
        }

        // POST: WebManager/AuthorSongs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var authorSong = await _context.AuthorSong.SingleOrDefaultAsync(m => m.ID == id);
            _context.AuthorSong.Remove(authorSong);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool AuthorSongExists(int id)
        {
            return _context.AuthorSong.Any(e => e.ID == id);
        }
    }
}
