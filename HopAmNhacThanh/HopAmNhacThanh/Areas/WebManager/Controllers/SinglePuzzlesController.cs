//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.EntityFrameworkCore;
//using HopAmNhacThanh.Data;
//using HopAmNhacThanh.Models;
//using HopAmNhacThanh.Areas.WebManager.ViewModels.SinglePuzzleViewModels;
//using Microsoft.AspNetCore.Identity;
//using HopAmNhacThanh.Areas.WebManager.ViewModels;
//using Microsoft.AspNetCore.Authorization;

//namespace HopAmNhacThanh.Areas.WebManager.Controllers
//{
//    [Area("WebManager")]
//    [Authorize(Roles = "Admin, Manager")]
//    public class SinglePuzzlesController : Controller
//    {
//        private readonly ISinglePuzzleManagerRepository _repository;
//        private readonly ApplicationDbContext _context;
//        private readonly UserManager<ApplicationUser> _userManager;

//        public SinglePuzzlesController(ISinglePuzzleManagerRepository repository,
//            ApplicationDbContext context,
//            UserManager<ApplicationUser> userManager)
//        {
//            _repository = repository;
//            _context = context;
//            _userManager = userManager;
//        }

//        // GET: WebManager/SinglePuzzles
//        [Route("/quan-ly-web/cau-do-moi-ngay/")]
//        public async Task<IActionResult> Index(string sortOrder,
// string currentFilter,
//    string searchString,
//    int? page, int? pageSize)
//        {
//            List<NumberItem> SoLuong = new List<NumberItem>
//            {
//                new NumberItem { Value = 10},
//                new NumberItem { Value = 20},
//                new NumberItem { Value = 50},
//                new NumberItem { Value = 100},
//            };
//            ViewData["SoLuong"] = SoLuong;
//            ViewData["CurrentSort"] = sortOrder;
//            ViewData["TitleParm"] = String.IsNullOrEmpty(sortOrder) ? "title" : "";
//            ViewData["CurrentSize"] = pageSize;
//            if (searchString != null)
//            {
//                page = 1;
//            }
//            else
//            {
//                searchString = currentFilter;
//            }

//            ViewData["CurrentFilter"] = searchString;
//            var applicationDbContext = await _repository.GetAll(sortOrder, searchString, page, pageSize);
//            return View(applicationDbContext);
//        }

//        // GET: WebManager/SinglePuzzles/Details/5
//        [Route("/quan-ly-web/cau-do-moi-ngay/chi-tiet/{id}")]
//        public async Task<IActionResult> Details(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var singlePuzzle = await _context.SinglePuzzle
//                .Include(s => s.Image)
//                .Include(s => s.Author)
//                .SingleOrDefaultAsync(m => m.ID == id);
//            if (singlePuzzle == null)
//            {
//                return NotFound();
//            }

//            return View(singlePuzzle);
//        }

//        // GET: WebManager/SinglePuzzles/Create
//        [Route("/quan-ly-web/cau-do-moi-ngay/tao-moi")]
//        public IActionResult Create()
//        {
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name");
//            ViewData["AuthorID"] = new SelectList(_context.Users, "Id", "FullName");
//            return View();
//        }

//        // POST: WebManager/SinglePuzzles/Create
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        [Route("/quan-ly-web/cau-do-moi-ngay/tao-moi")]
//        public async Task<IActionResult> Create(CreateSinglePuzzleViewModel model)
//        {
//            if (ModelState.IsValid)
//            {
//                model.AuthorID = (await GetCurrentUser()).Id;
//                await _repository.Add(model);
//                return RedirectToAction("Index");
//            }
            
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", model.ImageID);
//            return View(model);
//        }
//        private async Task<ApplicationUser> GetCurrentUser()
//        {
//            return await _userManager.GetUserAsync(HttpContext.User);
//        }
//        // GET: WebManager/SinglePuzzles/Edit/5
//        [Route("/quan-ly-web/cau-do-moi-ngay/chinh-sua/{id}")]
//        public async Task<IActionResult> Edit(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }
//            AllSelectList selectlist = new AllSelectList();
//            EditSinglePuzzleViewModels singlePuzzle = await _repository.GetEdit(id);
//            ViewData["Approved"] = new SelectList(selectlist.ListApproved, "ID", "Name", singlePuzzle.Approved);
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", singlePuzzle.ImageID);
//            return View(singlePuzzle);
//        }




//        // POST: WebManager/SinglePuzzles/Edit/5
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        [Route("/quan-ly-web/cau-do-moi-ngay/chinh-sua/{id}")]
//        public async Task<IActionResult> Edit(int id, EditSinglePuzzleViewModels singlePuzzle)
//        {
//            if (ModelState.IsValid)
//            {
//                try
//                {
//                    await _repository.Update(singlePuzzle);
//                }
//                catch (DbUpdateConcurrencyException)
//                {
//                    return NotFound();
//                }
//                return RedirectToAction("Index");
//            }
//            AllSelectList selectlist = new AllSelectList();
//            ViewData["Approved"] = new SelectList(selectlist.ListApproved, "ID", "Name", singlePuzzle.Approved);
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", singlePuzzle.ImageID);
//            return View(singlePuzzle);
//        }

//        // GET: WebManager/SinglePuzzles/Delete/5
//        [Route("/quan-ly-web/cau-do-moi-ngay/xoa/{id}")]
//        public async Task<IActionResult> Delete(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var singlePuzzle = await _repository.Get(id);
//            if (singlePuzzle == null)
//            {
//                return NotFound();
//            }

//            return View(singlePuzzle);
//        }

//        // POST: WebManager/SinglePuzzles/Delete/5
//        [Route("/quan-ly-web/cau-do-moi-ngay/xoa/{id}")]
//        [HttpPost, ActionName("Delete")]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> DeleteConfirmed(int id)
//        {
//            await _repository.Delete(id);
//            return RedirectToAction("Index");
//        }

//        private bool SinglePuzzleExists(int id)
//        {
//            return _context.SinglePuzzle.Any(e => e.ID == id);
//        }

//        [Route("/quan-ly-web/cau-do-moi-ngay/chinh-sua-xuat-ban/{id}")]
//        public async Task<IActionResult> EditPublishDT(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }
//            var singlePuzzle = await _repository.GetEditPublishDT(id);
//            return View(singlePuzzle);
//        }

//        [Route("/quan-ly-web/cau-do-moi-ngay/chinh-sua-xuat-ban/{id}")]
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> EditPublishDT(PublishDatetimeSinglePuzzleViewModel model)
//        {
//            if (ModelState.IsValid)
//            {
//                try
//                {
//                    await _repository.UpdatePublishDT(model);
//                }
//                catch (DbUpdateConcurrencyException)
//                {
//                    return NotFound();
//                }
//                return RedirectToAction("Index");
//            }
//            return View(model);
//        }
//    }
//}
