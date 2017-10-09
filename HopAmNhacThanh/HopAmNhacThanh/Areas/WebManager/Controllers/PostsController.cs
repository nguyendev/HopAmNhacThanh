//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.EntityFrameworkCore;
//using HopAmNhacThanh.Data;
//using HopAmNhacThanh.Models;
//using HopAmNhacThanh.Areas.WebManager.Data;
//using HopAmNhacThanh.Areas.WebManager.ViewModels.PostViewModels;
//using HopAmNhacThanh.Areas.WebManager.ViewModels;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Authorization;

//namespace HopAmNhacThanh.Areas.WebManager.Controllers
//{
//    [Area("WebManager")]
//    [Authorize(Roles = "Admin, Manager")]
//    public class PostsController : Controller
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly IPostManagerRepository _repository;
//        private readonly UserManager<ApplicationUser> _userManager;

//        public PostsController(
//            ApplicationDbContext context,
//            IPostManagerRepository repository,
//            UserManager<ApplicationUser> userManager)
//        {
//            _repository = repository;
//            _context = context;
//            _userManager = userManager;
//        }

//        // GET: WebManager/Posts
//        [Route("/quan-ly-web/blog/")]
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
//        private async Task<ApplicationUser> GetCurrentUser()
//        {
//            return await _userManager.GetUserAsync(HttpContext.User);
//        }
//        // GET: WebManager/Posts/Details/5
//        [Route("/quan-ly-web/blog/chi-tiet/{id}")]
//        public async Task<IActionResult> Details(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var post = await _repository.Get(id);
//            if (post == null)
//            {
//                return NotFound();
//            }

//            return View(post);
//        }

//        // GET: WebManager/Posts/Create
//        [Route("/quan-ly-web/blog/tao-moi")]
//        public IActionResult Create()
//        {
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name");
//            return View();
//        }

//        // POST: WebManager/Posts/Create
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        [Route("/quan-ly-web/blog/tao-moi")]
//        public async Task<IActionResult> Create( CreatePostViewModel post)
//        {
//            if (ModelState.IsValid)
//            {
//                var user = await GetCurrentUser();
//                post.AuthorID = user.Id;
//                await _repository.Add(post);
//                return RedirectToAction("Index");
//            }
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", post.ImageID);
//            return View(post);
//        }

//        // GET: WebManager/Posts/Edit/5
//        [Route("/quan-ly-web/blog/chinh-sua/{id}")]
//        public async Task<IActionResult> Edit(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var post = await _repository.GetEdit(id);
//            if (post == null)
//            {
//                return NotFound();
//            }
//            AllSelectList selectlist = new AllSelectList();
//            ViewData["Approved"] = new SelectList(selectlist.ListApproved, "ID", "Name", post.Approved);
//            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "FullName", post.AuthorID);
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", post.ImageID);
//            return View(post);
//        }

//        // POST: WebManager/Posts/Edit/5
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [Route("/quan-ly-web/blog/chinh-sua/{id}")]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> Edit(int id, EditPostViewModel post)
//        {
//            if (id != post.ID)
//            {
//                return NotFound();
//            }

//            if (ModelState.IsValid)
//            {
//                try
//                {
//                    await _repository.Update(post);
//                }
//                catch (DbUpdateConcurrencyException)
//                {
//                    if (!PostExists(post.ID))
//                    {
//                        return NotFound();
//                    }
//                    else
//                    {
//                        throw;
//                    }
//                }
//                return RedirectToAction("Index");
//            }
//            AllSelectList selectlist = new AllSelectList();
//            ViewData["Approved"] = new SelectList(selectlist.ListApproved, "ID", "Name", post.Approved);
//            ViewData["AuthorID"] = new SelectList(_context.ApplicationUser, "Id", "FullName", post.AuthorID);
//            ViewData["ImageID"] = new SelectList(_context.Images, "ID", "Name", post.ImageID);
//            return View(post);
//        }

//        // GET: WebManager/Posts/Delete/5
//        [Route("/quan-ly-web/blog/xoa/{id}")]
//        public async Task<IActionResult> Delete(int? id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var post = await _repository.Get(id);
//            if (post == null)
//            {
//                return NotFound();
//            }

//            return View(post);
//        }

//        // POST: WebManager/Posts/Delete/5
//        [HttpPost, ActionName("Delete")]
//        [Route("/quan-ly-web/blog/xoa/{id}")]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> DeleteConfirmed(int id)
//        {
//            await _repository.Delete(id);
//            return RedirectToAction("Index");
//        }

//        private bool PostExists(int id)
//        {
//            return _repository.Exists(id);
//        }
//    }
//}
