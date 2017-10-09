//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.EntityFrameworkCore;
//using HopAmNhacThanh.Areas.WebManager.Data;
//using HopAmNhacThanh.Models;
//using HopAmNhacThanh.Areas.WebManager.ViewModels;
//using HopAmNhacThanh.Extension;
//using Microsoft.AspNetCore.Authorization;

//namespace HopAmNhacThanh.Areas.WebManager.Controllers
//{
//    [Area("WebManager")]
//    [Authorize(Roles = "Admin, Manager")]
//    public class ApplicationUsersController : Controller
//    {
//        private readonly IApplicationUserManagerRepository _repository;

//        public ApplicationUsersController(IApplicationUserManagerRepository repository)
//        {
//            _repository = repository;    
//        }

//        // GET: WebManager/ApplicationUsers
//        [Route("/quan-ly-web/thanh-vien")]
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
//            ViewData["FullNameParm"] = String.IsNullOrEmpty(sortOrder) ? "fullName" : "";
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
//            PaginatedList<ApplicationUser> temp = await _repository.GetAll(sortOrder, searchString, page, pageSize);
//            return View(temp);
//        }

//        // GET: WebManager/ApplicationUsers/Details/5
//        [Route("/quan-ly-web/thanh-vien/chi-tiet/{id}")]
//        public async Task<IActionResult> Details(string id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var ApplicationUser = await _repository.Get(id);
//            if (ApplicationUser == null)
//            {
//                return NotFound();
//            }

//            return View(ApplicationUser);
//        }
//        [Route("/quan-ly-web/thanh-vien/chinh-sua/{id}")]
//        public async Task<IActionResult> Edit(string id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var ApplicationUser = await _repository.Get(id);
//            if (ApplicationUser == null)
//            {
//                return NotFound();
//            }
//            return View(ApplicationUser);
//        }

//        // POST: WebManager/ApplicationUsers/Edit/5
//        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
//        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        [Route("/quan-ly-web/thanh-vien/chinh-sua/{id}")]
//        public async Task<IActionResult> Edit(string id, [Bind("FullName,About,PictureSmall,Picture65x65,Slug,PictureBig,DateofBirth,Facebook,GooglePlus,Linkedin,Twitter,IdentityFacebook,Score,Website,CreateDT,Id,UserName,NormalizedUserName,Email,NormalizedEmail,EmailConfirmed,PasswordHash,SecurityStamp,ConcurrencyStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEnd,LockoutEnabled,AccessFailedCount")] ApplicationUser ApplicationUser)
//        {
//            if (id != ApplicationUser.Id)
//            {
//                return NotFound();
//            }

//            if (ModelState.IsValid)
//            {
//                try
//                {
//                    await _repository.Update(ApplicationUser);
//                }
//                catch (DbUpdateConcurrencyException)
//                {
//                    if (!ApplicationUserExists(ApplicationUser.Id))
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
//            return View(ApplicationUser);
//        }

//        // GET: WebManager/ApplicationUsers/Delete/5
//        [Route("/quan-ly-web/thanh-vien/xoa/{id}")]
//        public async Task<IActionResult> Delete(string id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var ApplicationUser = await _repository.Get(id);
//            if (ApplicationUser == null)
//            {
//                return NotFound();
//            }

//            return View(ApplicationUser);
//        }
//        [Route("/quan-ly-web/thanh-vien/xoa/{id}")]
//        // POST: WebManager/ApplicationUsers/Delete/5
//        [HttpPost, ActionName("Delete")]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> DeleteConfirmed(string id)
//        {
//            await _repository.Delete(id);
//            return RedirectToAction("Index");
//        }

//        private bool ApplicationUserExists(string id)
//        {
//            return _repository.Exists(id);
//        }
//    }
//}
