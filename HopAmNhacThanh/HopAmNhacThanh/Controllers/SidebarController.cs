using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HopAmNhacThanh.Data;
using HopAmNhacThanh.Models.SidebarViewModels;
using Microsoft.EntityFrameworkCore;
using HopAmNhacThanh.Data.SidebarRepository;
using HopAmNhacThanh.Services;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace HopAmNhacThanh.Controllers
{
    public class SidebarController : Controller
    {
        private readonly ISidebarRepository _repository;
        private readonly IViewRenderService _viewRenderService;

        public string Name { get; private set; }

        public SidebarController(ISidebarRepository repository,
            IViewRenderService viewRenderService)
        {
            _repository = repository;
            _viewRenderService = viewRenderService;
        }

        [HttpGet]
        public async Task<String> GetListCategory()
        {
            var ListCategory = await _repository.GetListCategory();
            string result = await _viewRenderService.RenderViewToStringAsync("Shared/Widget/ListCategoryPartial", ListCategory);
            return result;
        }

        [HttpGet]
        public async Task<String> GetListStyle()
        {
            List <SimpleStyleViewModel> listStyle = await _repository.GetListStyle();
            string result = await _viewRenderService.RenderViewToStringAsync("Shared/Widget/ListStylePartial", listStyle);
            return result;
        }

        [HttpGet]
        public async Task<String> GetListAlbum()
        {
            List<SimpleAlbumViewModel> ListAlbum = await _repository.GetListAlbum();
            string result = await _viewRenderService.RenderViewToStringAsync("Shared/Widget/ListAlbumPartial", ListAlbum);
            return result;
        }

        [HttpGet]
        public async Task<String> GetListTopSong()
        {
            List<BestSimpleSongViewModel> listSong = await _repository.GetListTopSong();
            string result = await _viewRenderService.RenderViewToStringAsync("Shared/Widget/ListTopSongPartial", listSong);
            return result;
        }

        [HttpGet]
        public async Task<String> GetFanpageFacebook()
        {
            //List<BestSimpleSongViewModel> listSong = await _repository.GetListTopSong();
            string result = await _viewRenderService.RenderViewToStringAsync("Shared/Widget/FanpageFacebookPartial", null);
            return result;
        }

        [HttpGet]
        public async Task<String> GetSongAphabet()
        {
            //List<BestSimpleSongViewModel> listSong = await _repository.GetListTopSong();
            string result = await _viewRenderService.RenderViewToStringAsync("Shared/Widget/SongAphabetPartial", null);
            return result;
        }
    }
}