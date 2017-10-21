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
    public class StylesManagerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public StylesManagerController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: WebManager/StylesManager
        public async Task<IActionResult> Index()
        {
            return View(await _context.Style.ToListAsync());
        }

        // GET: WebManager/StylesManager/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var style = await _context.Style
                .SingleOrDefaultAsync(m => m.ID == id);
            if (style == null)
            {
                return NotFound();
            }

            return View(style);
        }

        // GET: WebManager/StylesManager/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: WebManager/StylesManager/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Name,Slug,Note")] Style style)
        {
            if (ModelState.IsValid)
            {
                _context.Add(style);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(style);
        }

        // GET: WebManager/StylesManager/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var style = await _context.Style.SingleOrDefaultAsync(m => m.ID == id);
            if (style == null)
            {
                return NotFound();
            }
            return View(style);
        }

        // POST: WebManager/StylesManager/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Name,Slug,Note")] Style style)
        {
            if (id != style.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(style);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!StyleExists(style.ID))
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
            return View(style);
        }

        // GET: WebManager/StylesManager/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var style = await _context.Style
                .SingleOrDefaultAsync(m => m.ID == id);
            if (style == null)
            {
                return NotFound();
            }

            return View(style);
        }

        // POST: WebManager/StylesManager/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var style = await _context.Style.SingleOrDefaultAsync(m => m.ID == id);
            _context.Style.Remove(style);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool StyleExists(int id)
        {
            return _context.Style.Any(e => e.ID == id);
        }
    }
}
