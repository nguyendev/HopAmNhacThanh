//using HopAmNhacThanh.Areas.WebManager.ViewModels.MultiPuzzleViewModels;
//using HopAmNhacThanh.Areas.WebManager.ViewModels.SinglePuzzleViewModels;
//using HopAmNhacThanh.Extension;
//using HopAmNhacThanh.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace HopAmNhacThanh.Services
//{
//    public interface IMultiPuzzleManagerRepsository
//    {
//        //List<PuzzleType> GetPuzzleType();
//        Task<MultiPuzzle> Get(int? id);
//        bool Exists(int id);
//        Task<PaginatedList<MultiPuzzle>> GetAll(string sortOrder, string searchString,
//    int? page, int? pageSize);
//        Task Add(MultiPuzzle model);
//        Task Update(EditMultiPuzzleViewModel model);
//        Task Delete(int id);
//        Task<EditMultiPuzzleViewModel> GetEdit(int? id);
//        Task<PublishDatetimeSinglePuzzleViewModel> GetEditPublishDT(int? ID);
//        Task UpdatePublishDT(PublishDatetimeSinglePuzzleViewModel model);
//    }
//}
