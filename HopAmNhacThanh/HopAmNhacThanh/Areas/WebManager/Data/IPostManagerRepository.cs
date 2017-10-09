//using HopAmNhacThanh.Areas.WebManager.ViewModels.PostViewModels;
//using HopAmNhacThanh.Extension;
//using HopAmNhacThanh.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace HopAmNhacThanh.Areas.WebManager.Data
//{
//    public interface IPostManagerRepository
//    {
//        Task<Post> Get(int? id);
//        bool Exists(int id);
//        Task<PaginatedList<Post>> GetAll(string sortOrder, string searchString,
//    int? page, int? pageSize);
//        Task Add(CreatePostViewModel model);
//        Task Update(EditPostViewModel model);
//        Task Delete(int id);

//        Task<EditPostViewModel> GetEdit(int? ID);
//    }
//}
