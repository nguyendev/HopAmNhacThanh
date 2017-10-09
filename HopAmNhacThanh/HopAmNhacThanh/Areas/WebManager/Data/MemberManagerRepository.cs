//using HopAmNhacThanh.Data;
//using HopAmNhacThanh.Extension;
//using HopAmNhacThanh.Models;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace HopAmNhacThanh.Areas.WebManager.Data
//{
//    public class ApplicationUserManagerRepository : IApplicationUserManagerRepository
//    {
//        protected readonly ApplicationDbContext _context;

//        public ApplicationUserManagerRepository(ApplicationDbContext context)
//        {
//            _context = context;
//        }
//        public async Task<ApplicationUser> Get(string id)
//        {
//            return await _context.ApplicationUser
//                .SingleOrDefaultAsync(m => m.Id == id);
//        }
//        public bool Exists(string id)
//        {
//            return _context.ApplicationUser.Any(c => c.Id == id);
//        }

//        public async Task<PaginatedList<ApplicationUser>> GetAll(string sortOrder, string searchString,
//    int? page, int? pageSize)
//        {
//            var ApplicationUsers = from s in _context.ApplicationUser
//                                select s;
//            if (!String.IsNullOrEmpty(searchString))
//            {
//                ApplicationUsers = ApplicationUsers.Where(s => s.FullName.Contains(searchString));
//            }
//            switch (sortOrder)
//            {
//                case "fullName":
//                    ApplicationUsers = ApplicationUsers.OrderByDescending(s => s.FullName);
//                    break;
//                default:
//                    ApplicationUsers = ApplicationUsers.OrderBy(s => s.CreateDT);
//                    break;
//            }
//            return await PaginatedList<ApplicationUser>.CreateAsync(ApplicationUsers, page ?? 1, pageSize != null ? pageSize.Value : 10);
//        }

//        public async Task Update(ApplicationUser model)
//        {
//            _context.Update(model);
//            await _context.SaveChangesAsync();
//        }

//        public async Task Delete(string id)
//        {
//            var ApplicationUser = await _context.ApplicationUser.SingleOrDefaultAsync(m => m.Id == id);
//            _context.ApplicationUser.Remove(ApplicationUser);
//            if (ApplicationUser.IsDeleted)
//                _context.ApplicationUser.Remove(ApplicationUser);
//            else
//            {
//                ApplicationUser.IsDeleted = true;
//                _context.ApplicationUser.Update(ApplicationUser);
//            }
//            await Save();
//        }

//        private async Task Save()
//        {
//            await _context.SaveChangesAsync();
//        }
//        public async Task<ApplicationUser> GetEdit(string ID)
//        {
//            var singlePuzzleDbContext = await _context.ApplicationUser.SingleOrDefaultAsync(p => p.Id == ID);
//            return singlePuzzleDbContext;
//            //if (singlePuzzleDbContext != null)
//            //{
//            //    var tags = await _context.SingPuzzleTag.
//            //        Include(p => p.Tag).
//            //        Where(p => p.SinglePuzzleID == singlePuzzleDbContext.ID).
//            //        ToListAsync();
//            //    string tempTag = "";
//            //    foreach (var item in tags)
//            //    {
//            //        tempTag = tempTag + item.Tag.Title + ", ";
//            //    }
//            //    EditSinglePuzzleViewModels editModel = new EditSinglePuzzleViewModels
//            //    {
//            //        ID = singlePuzzleDbContext.ID,
//            //        Title = singlePuzzleDbContext.Title,
//            //        Description = singlePuzzleDbContext.Description,
//            //        AnswerA = singlePuzzleDbContext.AnswerA,
//            //        AnswerB = singlePuzzleDbContext.AnswerB,
//            //        AnswerC = singlePuzzleDbContext.AnswerC,
//            //        AnswerD = singlePuzzleDbContext.AnswerD,
//            //        Correct = singlePuzzleDbContext.Correct,
//            //        Image = singlePuzzleDbContext.Image,
//            //        ImageID = singlePuzzleDbContext.ImageID,
//            //        IsYesNo = singlePuzzleDbContext.IsYesNo,
//            //        Note = singlePuzzleDbContext.Note,
//            //        Reason = singlePuzzleDbContext.Reason,
//            //        Slug = singlePuzzleDbContext.Slug,
//            //        Active = singlePuzzleDbContext.Active,
//            //        Approved = singlePuzzleDbContext.Approved,
//            //        IsDelete = singlePuzzleDbContext.IsDeleted,
//            //        IsMMultiPuzzle = singlePuzzleDbContext.IsMMultiPuzzle,
//            //        MultiPuzzleID = singlePuzzleDbContext.MMultiPuzzleID,
//            //        TempTag = tempTag
//            //    };
//            //    return editModel;
//            //}
//            //return null;
//        }
//    }
//}
